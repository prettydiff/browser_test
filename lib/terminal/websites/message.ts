
/* lib/terminal/websites/message - Message input/output to the browser via Chrome Developer Tools Protocol (CDP). */

import requestTargetList from "./requestTargetList.js";
import error from "../utilities/error.js";
import log from "../utilities/log.js";
import results from "./results.js";
import vars from "../utilities/vars.js";

// @ts-ignore - the WS library is not written with TypeScript or type identity in mind
import WebSocket from "../../ws-es6/index.js";

let id:number = 0,
    frameId:string = "",
    testIndex:number = 0,
    tests:testBrowserItem[] = null,
    finished:boolean = false;
const targets:targetList = {},
    bringToFront = function terminal_websites_message_bringToFront():void {
        if (message.ws !== null) {
            message.send("Target.activateTarget", {
                targetId: targets.page[tests[testIndex].page]
            });
            message.send("Page.bringToFront");
        }
    },
    message = function terminal_websites_message(config:browserMessageConfig):void {
        let loaderId:string = "",
            remote:string = "";
        const populateTargets = function terminal_websites_message_populateTargets(listString:string):void {
                const list:targetListItem[] = JSON.parse(listString),
                    listLength:number = list.length;
                let a:number = 0,
                    b:number = 0,
                    insert:boolean = true;
                // loop through target object by target type
                do {
                    if (targets[list[a].type] === undefined) {
                        targets[list[a].type] = [];
                    }
                    b = targets[list[a].type].length;
                    insert = true;
                    if (b > 0) {
                        // loop through a target type list
                        do {
                            b = b - 1;
                            if (targets[list[a].type][b].id === list[a].id) {
                                targets[list[a].type][b].url = list[a].url;
                                insert = false;
                                break;
                            }
                        } while (b > 0);
                    }
                    if (insert === true) {
                        targets[list[a].type].push(list[a]);
                        if (message.ws !== null) {
                            message.send("Target.activateTarget", {
                                targetId: list[a].id
                            });
                            sendRemote();
                            message.send("Page.reload", {
                                ignoreCache: false
                            });
                        }
                    }
                    a = a + 1;
                } while (a < listLength);
                bringToFront();
            },
            sendRemote = function terminal_websites_message_sendRemote():void {
                message.send("Page.addScriptToEvaluateOnNewDocument", {
                    source: remote
                });
            };

        // populate targets from initial page request
        populateTargets(config.responseBody);
        tests = config.campaign.tests;

        // create a web socket client
        message.ws = new WebSocket(targets.page[0].webSocketDebuggerUrl, {perMessageDeflate: false});
        message.ws.on("open", function terminal_websites_message_wsOpen():void {
            vars.node.fs.readFile(`${vars.js}lib${vars.sep}browser${vars.sep}remote.js`, function terminal_websites_message_readRemote(readError:Error, fileData:string):void {
                if (readError === null) {
                    remote = fileData.toString().replace(/serverPort:\s+\d+,/, `serverPort: ${config.serverAddress.port},`).replace("export {}", "");
                    message.send("Page.enable");
                    sendRemote();
                    message.send("Network.enable");
                    message.send("Log.enable");
                    message.send("Runtime.enable");
                    message.send("DOM.enable");
                    message.send("Page.navigate", {
                        transitionType: "address_bar",
                        url: config.campaign.startPage
                    });
                } else {
                    error([readError.toString()]);
                }
            });
        });
        message.ws.on("message", function terminal_websites_message_wsMessage(data:string):void {
            // eslint-ignore-next-line
            const parsed:any = JSON.parse(data),
                method:string = parsed.method;
            if (config.options.browserMessaging === true && data.indexOf("{\"method\":\"Network.") !== 0 && data.indexOf("DBG-SERVER:") !== 0 && data.indexOf("EMITTING:") !== 0) {
                // print out all browser messaging except network traffic
                log([data.slice(0, 250)]);
            }
            if (frameId === "" && method === "Page.frameStartedLoading") {
                // get the frameId for the starting page
                // this is a compatibility work around for Firefox
                // see: https://bugzilla.mozilla.org/show_bug.cgi?id=1691501
                frameId = parsed.params.frameId;
            } else if (method === "Page.domContentEventFired") {
                // inject code into next requested page
                sendRemote();
            } else if (method === "Runtime.consoleAPICalled" && data.indexOf("Drial - report") > 0) {
                // reading a test result from the browser
                const result:testBrowserRoute = JSON.parse(parsed.params.args[0].value.replace("Drial - report:", ""));
                results(result, config.campaign.tests, config.options.noClose);
            } else if (method === "Page.frameStoppedLoading" && data.indexOf(frameId) > 0) {
                // send a test
                message.sendTest(testIndex, true);
            } else if (loaderId === "" && method === "Network.requestWillBeSent" && data.indexOf(config.campaign.startPage) > 0) {
                // grab the session identifiers when the test starts
                // eslint-disable-next-line
                frameId = parsed.params.frameId;
                loaderId = parsed.params.loaderId;
            } else if (method === "Page.windowOpen") {
                // update target list each time a new page window is opened
                requestTargetList(function terminal_websites_message_wsMessage_browserList(listString:string):void {
                    populateTargets(listString);
                }, config.options.port, config.options.browser);
            } else if ((/\{"id":\d+,"result":\{"exceptionDetails":\{"text":"window.drialRemote is undefined"\}\}\}/).test(data) === true) {
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
                message.send("Browser.close");
                error(errorMessage, 1);
            }
        });
    };
// every message to CDP must have a unique id
// eslint-disable-next-line
message.send = function terminal_websites_message_send(method:string, params?:any):void {
    id = id + 1;
    message.ws.send(JSON.stringify({
        id: id,
        method: method,
        params: params
    }));
};
message.sendClose = function terminal_websites_message_sendClose(noClose:boolean, exitType:0|1):void {
    // close the browser
    finished = true;
    if (noClose === false) {
        message.send("Browser.close");
        process.exit(exitType);
    }
};
message.sendTest = function terminal_websites_message_sendTest(index:number, refresh:boolean):void {
    // send a test
    if (finished === false) {
        const sendWrapper = function terminal_websites_message_sendTest_sendWrapper():void {
            // define the test package
            const route:testBrowserRoute = {
                action: "result",
                exit: null,
                index: index,
                result: null,
                test: tests[index]
            };
            if (refresh === true) {
                // an interaction that triggers a page refresh must be set to null to avoid a loop
                route.test.interaction = null;
            }
            // send the current test to the browser
            testIndex = route.index;
            message.send("Runtime.evaluate", {
                expression: `window.drialRemote.parse('${JSON.stringify(route).replace(/'/g, "\\'")}')`
            });
        };
        if (index > 0 && tests[index].page !== tests[index - 1].page) {
            // ensure a different page is active and visible
            bringToFront();
        }
        sendWrapper();
    }
};
message.ws = null;

export default message;