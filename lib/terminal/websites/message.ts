
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
                    }
                    a = a + 1;
                } while (a < listLength);
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
                    message.send("Page.reload", {
                        ignoreCache: true
                    });
                } else {
                    error([readError.toString()]);
                }
            });
        });
        message.ws.on("message", function terminal_websites_message_wsMessage(data:string):void {
            if (config.options.browserMessaging === true && data.indexOf("{\"method\":\"Network.") !== 0 && data.indexOf("DBG-SERVER:") !== 0 && data.indexOf("EMITTING:") !== 0) {
                // print out all browser messaging except network traffic
                log([data.slice(0, 250)]);
            }
            if (frameId === "" && data.indexOf("{\"method\":\"Page.frameStartedLoading\"") === 0) {
                // get the frameId for the starting page
                frameId = JSON.parse(data).params.frameId;
            } else if (data.indexOf("{\"method\":\"Page.domContentEventFired\"") === 0) {
                // inject code into next requested page
                sendRemote();
            } else if (data.indexOf("{\"method\":\"Runtime.consoleAPICalled\"") === 0 && data.indexOf("Drial - report") > 0) {
                // reading a test result from the browser
                const result:testBrowserRoute = JSON.parse(JSON.parse(data).params.args[0].value.replace("Drial - report:", ""));
                results(result, config.campaign.tests, config.options.noClose);
            } else if (data.indexOf("{\"method\":\"Page.frameStoppedLoading\"") === 0 && data.indexOf(frameId) > 0) {
                // send a test
                message.sendTest(testIndex, true);console.log("send test");
            } else if (loaderId === "" && data.indexOf("{\"method\":\"Network.requestWillBeSent\"") === 0 && data.indexOf(config.campaign.startPage) > 0) {
                // grab the session identifiers when the test starts
                // eslint-disable-next-line
                const payload:any = JSON.parse(data);
                frameId = payload.params.frameId;
                loaderId = payload.params.loaderId;
            } else if (data.indexOf("{\"method\":\"Page.windowOpen\",") === 0) {
                // update target list each time a new page window is opened
                requestTargetList(function terminal_websites_message_wsMessage_browserList(listString:string):void {
                    populateTargets(listString);
                }, config.options.port, config.options.browser);
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
    if (finished === false) {
        // send a test
        const route:testBrowserRoute = {
            action: "result",
            exit: null,
            index: index,
            result: null,
            test: tests[index]
        };
        if (refresh === true) {
            route.test.interaction = null;
        }
        testIndex = route.index;
        message.send("Runtime.evaluate", {
            expression: `window.drialRemote.parse('${JSON.stringify(route).replace(/'/g, "\\'")}')`
        });
    }
};
message.ws = null;

export default message;