
/* lib/terminal/websites/message - Message input/output to the browser via Chrome Developer Tools Protocol (CDP). */

import { readFile, writeFile } from "fs";
import { Protocol } from "devtools-protocol";

import error from "../utilities/error.js";
import results from "./results.js";
import vars from "../utilities/vars.js";

// @ts-ignore - the WS library is not written with TypeScript or type identity in mind
import WebSocket from "../../ws-es6/index.js";

let sendMessage:boolean = false,
    now:number = Date.now(),
    interval:NodeJS.Timeout = null;
const message:messageModule = {
    activePage: 0,

    // initiates messaging from application start
    application: function terminal_websites_message_application(config:browserMessageConfig):void {
        let remote:string = "",
            opened:number = 0,
            openedTotal:number = 0;
        const currentPage:number = message.activePage,
            populateTargets = function terminal_websites_message_application_populateTargets(list:targetListItem[], queueId:number):void {
                const listLength:number = list.length;
                let a:number = 0,
                    b:number = 0,
                    insert:boolean = true,
                    id:string = "";
                // loop through target object by target type
                do {
                    if (message.targets[list[a].type] === undefined) {
                        message.targets[list[a].type] = [];
                    }
                    b = message.targets[list[a].type].length;
                    id = (list[a].id === undefined)
                        ? list[a].targetId
                        : list[a].id;
                    insert = true;
                    if (b > 0) {
                        // loop through a target type list
                        do {
                            b = b - 1;
                            if (message.targets[list[a].type][b].id === id) {
                                message.targets[list[a].type][b].url = list[a].url;
                                insert = false;
                                break;
                            }
                        } while (b > 0);
                    }
                    if (insert === true) {
                        message.targets[list[a].type].push(list[a]);
                        if (list[a].type === "page") {
                            list[a].id = id;
                            list[a].ready = false;
                            list[a].ws = new WebSocket(`ws://127.0.0.1:${config.options.port}/devtools/page/${id}`, {perMessageDeflate: false});
                            list[a].ws.pageId = message.targets.page.length - 1;
                            list[a].ws.targetId = id;
                            list[a].ws.on("message", wsMessage);
                            opened = opened + 1;
                            list[a].ws.on("open", wsOpen);
                        }
                    }
                    a = a + 1;
                } while (a < listLength);
                if (queueId > 0) {
                    queue(queueId);
                }
            },
            sendRemote = function terminal_websites_message_sendRemote():void {
                message.sendToQueue("Page.addScriptToEvaluateOnNewDocument", {
                    source: remote
                });
            },
            queue = function terminal_websites_message_application_queue(id:number):void {
                message.indexMessage = id + 1;
                if (message.indexMessage === message.messageQueue.length) {
                    sendMessage = true;
                } else {
                    sendMessage = false;
                    message.send();
                }
            },
            pageReady = function terminal_websites_message_application_pageReady(id:string):void {
                let a:number = message.targets.page.length;
                do {
                    a = a - 1;
                    if (message.targets.page[a].id === id) {
                        message.targets.page[a].ready = true;
                        if (a === message.activePage) {
                            message.sendTest(message.indexTest, true);
                        }
                        return;
                    }
                } while (a > 0);
            },
            wsMessage = function terminal_websites_message_application_wsMessage(data:string):void {
                const parsed:devtoolsParameters = JSON.parse(data),
                    runTime:Protocol.Runtime.EvaluateResponse = JSON.parse(data).result,
                    method:string = parsed.method;
                now = Date.now();
                if ((/^\{"id":\d+,"result":\{/).test(data) === true) {
                    const errorHandler = function terminal_websites_message_application_wsMessage_errorHandler(errorMessage:string[]):void {
                            message.writeLog(function terminal_websites_message_application_wsMessage_errorHandler_callback():void {
                                error(errorMessage, 1);
                            });
                        },
                        item:messageItem = message.messageQueue[parsed.id];

                    // format and log response data
                    parsed.method = item.method;
                    if (parsed.method === "Runtime.evaluate") {
                        parsed.page = `${message.tests[item.params.testId].page}, ${message.targets.page[message.tests[item.params.testId].page].url}`;
                        parsed.testId = item.params.testId;
                        parsed.testName = item.params.testName;
                    }
                    message.log.messages.response.push(parsed);
                    message.log.messages_summary.response.push(`${message.log.messages_summary.response.length}, ${parsed.method}`);

                    if (runTime.exceptionDetails !== undefined && runTime.exceptionDetails.text === "window.drialRemote is undefined") {
                        // browser does not support the Page.addScriptToEvaluateOnNewDocument CDP method, so error
                        const errorMessage:string[] = [
                            `Browser ${vars.text.angry + config.options.browser} is not supported${vars.text.none} by ${vars.text.cyan}drial${vars.text.none} due to missing a required feature:`,
                            `${vars.text.cyan}Page.addScriptToEvaluateOnNewDocument${vars.text.none} of Chrome DevTools Protocol (CDP)`,
                            "https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-addScriptToEvaluateOnNewDocument"
                        ];
                        if (config.options.browser === "firefox") {
                            errorMessage.push("");
                            errorMessage.push(`For firefox see defect ${vars.text.green + vars.text.bold}1601695${vars.text.none}, https://bugzilla.mozilla.org/show_bug.cgi?id=1601695`);
                        }
                        message.sendToQueue("Browser.close", {});
                        errorHandler(errorMessage);
                    } else if (runTime.result !== undefined && runTime.result.description !== undefined && runTime.result.description.indexOf("TypeError: Cannot read property 'parse' of undefined\n") === 0) {
                        // error - file remote not injected into page
                        const item:messageItem = message.messageQueue[parsed.id],
                            errorMessage:string[] = [
                                `${vars.text.angry}Test failure.  Required file not injected into page:${vars.text.none}`,
                                `Page index ${message.tests[item.params.testId].page}, ${message.targets.page[message.tests[item.params.testId].page].url}`
                            ];
                        message.sendToQueue("Browser.close", {});
                        errorHandler(errorMessage);
                    } else {
                        const targets:Protocol.Target.GetTargetsResponse = JSON.parse(data).result;
                        if (targets.targetInfos === undefined) {
                            queue(parsed.id);
                        } else {
                            populateTargets(targets.targetInfos as targetListItem[], parsed.id);
                        }
                    }
                } else {
                    const page:Protocol.Page.FrameStartedLoadingEvent = JSON.parse(data).params;
                    message.log.messages.events.push(parsed);
                    message.log.messages_summary.events.push(`${message.log.messages_summary.events.length}, ${method}`);
                    if (method === "Page.domContentEventFired") {
                        // inject code into next requested page
                        message.targets.page[message.activePage].ready = false;
                        sendRemote();
                    } else if (method === "Runtime.consoleAPICalled" && data.indexOf("Drial - report") > 0) {
                        // reading a test result from the browser
                        const consoleEvent:Protocol.Runtime.ConsoleAPICalledEvent = JSON.parse(data).params,
                            result:testBrowserRoute = JSON.parse(consoleEvent.args[0].value.replace("Drial - report:", ""));
                        results(result, config.options.noClose);
                    } else if (method === "Page.frameStoppedLoading") {
                        // send a test
                        pageReady(page.frameId);
                    } else if (method === "Page.windowOpen") {
                        message.sendToQueue("Target.getTargets", {});
                    }
                }
            },
            wsOpen = function terminal_websites_message_application_wsOpen():void {
                // eslint-disable-next-line
                const pageId:number = this.pageId;
                message.switchPage(pageId, true);
                message.sendToQueue("Runtime.enable", {});
                message.sendToQueue("Page.enable", {});

                sendRemote();
                if (message.targets.page.length === 1) {
                    message.sendToQueue("Page.navigate", {
                        transitionType: "address_bar",
                        url: config.campaign.startPage
                    });
                    message.send();
                } else {
                    message.sendToQueue("Page.reload", {
                        ignoreCache: false
                    });
                    openedTotal = openedTotal + 1;
                    if (openedTotal === opened) {
                        message.switchPage(currentPage, true);
                    }
                }
            };
        
        message.log.options = config.options;

        // the interval ensures that logs are written even if the application cannot close on its own due to lost messaging
        interval = setInterval(function terminal_websites_message_application_interval():void {
            if (Date.now() - now > 10000) {
                clearInterval(interval);
                message.writeLog(function terminal_websites_message_application_interval_handler():void {
                    const hung:string[] = [
                        `${vars.text.angry}Application has hung for more than 10 seconds.${vars.text.none}`,
                        "This could be due to one of two cases:",
                        `1. Most likely the ${vars.text.angry}page isn't ready${vars.text.none} for the requested user interaction.`,
                        "   Try a wait event in the test campaign immediately prior to the failing event.",
                        "   Example: {event: \"wait\", node: [], value: \"1000\"}",
                        `2. This ${vars.text.angry}application submitted incorrect instructions${vars.text.none} to the browser,`,
                        "   which breaks the browser's ability to send a response.",
                        "   Incorrect instructions is the less likely cause of this problem.",
                        "",
                        "Logs written.\u0007"
                    ];
                    error(hung);
                    message.sendClose(config.options.noClose, 1);
                });
            }
        }, 4000);
        
        // read the remote.js as a string for injection into a page
        readFile(`${vars.js}lib${vars.sep}browser${vars.sep}remote.js`, function terminal_websites_message_readRemote(readError:Error, fileData:Buffer):void {
            if (readError === null) {
                message.tests = config.campaign.tests;
                remote = fileData.toString().replace(/serverPort:\s+\d+,/, `serverPort: ${config.serverAddress.port},`).replace("export {}", "");

                // populate targets from initial page request
                populateTargets(JSON.parse(config.responseBody), 0);
            } else {
                error([readError.toString()], 1);
            }
        });
    },

    // index of the test list
    indexMessage: 0,

    // index of the message queue
    indexTest: 0,

    log: {
        devtool_targets: null,
        messages: {
            events: [],
            response: [],
            sent: []
        },
        messages_summary: {
            events: [],
            response: [],
            sent: []
        },
        options: null
    },

    // ordered list of messages to send to the browser
    messageQueue: [],

    // sends a given message to the browser
    send: function terminal_websites_message_send():void {
        message.log.messages.sent.push(message.messageQueue[message.indexMessage]);
        message.log.messages_summary.sent.push(`${message.indexMessage}, ${message.messageQueue[message.indexMessage].method}`);
        message.targets.page[message.activePage].ws.send(JSON.stringify(message.messageQueue[message.indexMessage]));
        if (message.messageQueue[message.indexMessage].method === "Page.addScriptToEvaluateOnNewDocument") {
            message.messageQueue[message.indexMessage].params = {};
        }
    },

    // close the browser when tests are complete
    sendClose: function terminal_websites_message_sendClose(noClose:boolean, exitType:0|1):void {
        clearInterval(interval);
        if (noClose === false) {
            let a:number = message.targets.page.length;
            if (a < 2) {
                message.sendToQueue("Browser.close", {});
            } else {
                do {
                    a = a - 1;
                    message.switchPage(a, false);
                    message.sendToQueue("Browser.close", {});
                } while (a > 0);
            }
        }
        setTimeout(function terminal_websites_message_sendClose_exitInterval():void {
            message.writeLog(function terminal_websites_message_sendClose_exitInterval_writeLog():void {
                if (noClose === false) {
                    process.exit(exitType);
                }
            });
        }, 150);
    },

    // queue a test into the message queue
    sendTest: function terminal_websites_message_sendTest(index:number, refresh:boolean):void {
        const route:testBrowserRoute = {
            action: "result",
            exit: null,
            index: index,
            result: null,
            test: message.tests[index]
        };
        message.indexTest = index;
        if (message.activePage !== message.tests[index].page) {
            // ensure a different page is active and visible
            message.switchPage(message.tests[index].page, false);
        }
        if (refresh === true) {
            // an interaction that triggers a page refresh must be set to null to avoid a loop
            route.test.interaction = null;
        }
        // send the current test to the browser
        message.sendToQueue("Runtime.evaluate", {
            expression: `window.drialRemote.parse('${JSON.stringify(route).replace(/'/g, "\\'")}')`,
            testId: index,
            testName: message.tests[index].name
        });
    },

    // pushes uniform message data into the message queue
    // eslint-disable-next-line
    sendToQueue: function terminal_websites_message_send(method:string, params:devtoolsParameters):void {
        message.messageQueue.push({
            id: message.messageQueue.length,
            method: method,
            params: (params === undefined)
                ? {}
                : params
        });
        if (sendMessage === true && message.messageQueue.length > message.indexMessage) {
            sendMessage = false;
            message.send();
        }
    },

    // switch between pages of different tabs/windows
    switchPage: function terminal_websites_message_switchPage(pageIndex:number, newPage:boolean):void {
        message.activePage = pageIndex;
        if (newPage === false) {
            message.sendToQueue("Page.bringToFront", {});
        }
    },

    // store lists of communication points in the browser
    targets: {},

    // the test instructions from the campaign document
    tests: null,

    // write communication data to file
    writeLog: function terminal_websites_message_writeLog(callback:() => void):void {
        message.targets.page.forEach(function terminal_websites_message_writeLog_pageSockets(target:targetListItem):void {
            target.ws = null;
        });
        writeFile(`${vars.projectPath}log.json`, JSON.stringify(message.log).replace(/"devtool_targets":null,/, `"devtool_targets":${JSON.stringify(message.targets)},`), "utf8", function terminal_websites_message_writeLog_callback():void {
            callback();
        });
    }
};

export default message;