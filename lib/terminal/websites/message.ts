
/* lib/terminal/websites/message - Message input/output to the browser via Chrome Developer Tools Protocol (CDP). */

import { readFile } from "fs";
import { Protocol } from "devtools-protocol";

import error from "../utilities/error.js";
import log from "../utilities/log.js";
import results from "./results.js";
import vars from "../utilities/vars.js";

// @ts-ignore - the WS library is not written with TypeScript or type identity in mind
import WebSocket from "../../ws-es6/index.js";

let sendMessage:boolean = false,
    frameId:string = "",
    tests:testBrowserItem[] = null,
    finished:boolean = false;
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
                    insert:boolean = true;
                // loop through target object by target type
                do {
                    if (message.targets[list[a].type] === undefined) {
                        message.targets[list[a].type] = [];
                    }
                    b = message.targets[list[a].type].length;
                    insert = true;
                    if (b > 0) {
                        // loop through a target type list
                        do {
                            b = b - 1;
                            if (message.targets[list[a].type][b].id === list[a].id) {
                                message.targets[list[a].type][b].url = list[a].url;
                                insert = false;
                                break;
                            }
                        } while (b > 0);
                    }
                    if (insert === true) {
                        message.targets[list[a].type].push(list[a]);
                        if (list[a].type === "page") {
                            let id:string = (list[a].id === undefined)
                                ? list[a].targetId
                                : list[a].id;
                            list[a].id = id;
                            list[a].ws = new WebSocket(`ws://127.0.0.1:${config.options.port}/devtools/page/${id}`, {perMessageDeflate: false});
                            list[a].ws.pageId = message.targets.page.length - 1;
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
            queue = function terminal_websites_message_application_wsMessage_queue(id:number):void {
                message.indexMessage = id + 1;
                if (message.indexMessage === message.messageQueue.length) {
                    sendMessage = true;
                } else {
                    sendMessage = false;
                    message.send();
                }
            },
            wsMessage = function terminal_websites_message_application_wsMessage(data:string):void {
                const parsed:devtoolsParameters = JSON.parse(data),
                    runTime:Protocol.Runtime.EvaluateResponse = JSON.parse(data).result,
                    method:string = parsed.method;
                if ((/^\{"id":\d+,"result":\{/).test(data) === true) {
                    if (config.options.browserMessaging === true) {
                        const item:messageItem = message.messageQueue[parsed.id];
                        // print out all browser messaging except network traffic
                        parsed.method = item.method;
                        if (parsed.method === "Runtime.evaluate") {
                            parsed.page = `${tests[item.params.testId].page}, ${message.targets.page[tests[item.params.testId].page].url}`;
                            parsed.testId = item.params.testId;
                            parsed.testName = item.params.testName;
                        }
                    }
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
                        error(errorMessage, 1);
                    } else if (runTime.result !== undefined && runTime.result.description !== undefined && runTime.result.description.indexOf("TypeError: Cannot read property 'parse' of undefined\n") === 0) {
                        // error - file remote not injected into page
                        const item:messageItem = message.messageQueue[parsed.id],
                            errorMessage:string[] = [
                                `${vars.text.angry}Test failure.  Required file not injected into page:${vars.text.none}`,
                                `Page index ${tests[item.params.testId].page}, ${message.targets.page[tests[item.params.testId].page].url}`
                            ];
                        message.sendToQueue("Browser.close", {});
                        error(errorMessage, 1);
                    } else {
                        const targetInfos:targetListItem[] = JSON.parse(data).result;
                        if (targetInfos !== undefined) {
                            populateTargets(targetInfos, parsed.id);
                        } else {
                            queue(parsed.id);
                        }
                    }
                } else {
                    const page:Protocol.Page.FrameStartedLoadingEvent = JSON.parse(data).params;
                    if (frameId === "" && method === "Page.frameStartedLoading") {
                        // get the frameId for the starting page
                        // this is a compatibility work around for Firefox
                        // see: https://bugzilla.mozilla.org/show_bug.cgi?id=1691501
                        frameId = page.frameId;
                    } else if (method === "Page.domContentEventFired") {
                        // inject code into next requested page
                        sendRemote();
                    } else if (method === "Runtime.consoleAPICalled" && data.indexOf("Drial - report") > 0) {
                        // reading a test result from the browser
                        const consoleEvent:Protocol.Runtime.ConsoleAPICalledEvent = JSON.parse(data).params,
                            result:testBrowserRoute = JSON.parse(consoleEvent.args[0].value.replace("Drial - report:", ""));
                        results(result, config.campaign.tests, config.options.noClose);
                    } else if (method === "Page.frameStoppedLoading" && data.indexOf(frameId) > 0) {
                        // send a test
                        message.sendTest(message.indexTest, true);
                    } else if (method === "Page.windowOpen") {
                        message.sendToQueue("Target.getTargets", {});
                    }
                }
            },
            wsOpen = function terminal_websites_message_application_wsOpen():void {
                // eslint-disable-next-line
                message.switchPage(this.pageId, true);
                sendRemote();
                message.sendToQueue("Page.reload", {
                    ignoreCache: false
                });
                openedTotal = openedTotal + 1;
                if (openedTotal === opened) {
                    message.switchPage(currentPage, true);
                }
            };
        
        // read the remote.js as a string for injection into a page
        readFile(`${vars.js}lib${vars.sep}browser${vars.sep}remote.js`, function terminal_websites_message_readRemote(readError:Error, fileData:Buffer):void {
            if (readError === null) {
                remote = fileData.toString().replace(/serverPort:\s+\d+,/, `serverPort: ${config.serverAddress.port},`).replace("export {}", "");
                message.sendToQueue("Page.enable", {});
                sendRemote();
                message.sendToQueue("Runtime.enable", {});
                message.sendToQueue("Page.navigate", {
                    transitionType: "address_bar",
                    url: config.campaign.startPage
                });
                message.send();
            } else {
                error([readError.toString()]);
            }
        });

        // populate targets from initial page request
        populateTargets(JSON.parse(config.responseBody), 0);
        tests = config.campaign.tests;
    },

    // index of the test list
    indexMessage: 0,

    // index of the message queue
    indexTest: 0,

    // ordered list of messages to send to the browser
    messageQueue: [],

    // sends a given message to the browser
    send: function terminal_websites_message_send():void {
        message.targets.page[message.activePage].ws.send(JSON.stringify(message.messageQueue[message.indexMessage]));
        if (message.messageQueue[message.indexMessage].method === "Page.addScriptToEvaluateOnNewDocument") {
            message.messageQueue[message.indexMessage].params = {};
        }
    },

    // close the browser when tests are complete
    sendClose: function terminal_websites_message_sendClose(noClose:boolean, exitType:0|1):void {
        finished = true;
        if (noClose === false) {
            message.sendToQueue("Browser.close", {});
            process.exit(exitType);
        }
    },

    // queue a test into the message queue
    sendTest: function terminal_websites_message_sendTest(index:number, refresh:boolean):void {
        if (finished === false) {
            const route:testBrowserRoute = {
                action: "result",
                exit: null,
                index: index,
                result: null,
                test: tests[index]
            };
            message.indexTest = index;
            if (message.activePage !== tests[index].page) {
                // ensure a different page is active and visible
                message.switchPage(tests[index].page, false);
            }
            if (refresh === true) {
                // an interaction that triggers a page refresh must be set to null to avoid a loop
                route.test.interaction = null;
            }
            // send the current test to the browser
            message.sendToQueue("Runtime.evaluate", {
                expression: `window.drialRemote.parse('${JSON.stringify(route).replace(/'/g, "\\'")}')`,
                testId: index,
                testName: tests[index].name
            });
        }
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
    targets: {}
};

export default message;