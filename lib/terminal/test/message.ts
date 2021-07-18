
/* lib/terminal/test/message - Message input/output to the browser via Chrome Developer Tools Protocol (CDP). */

import error from "../utilities/error.js";
import results from "./results.js";
import vars from "../utilities/vars.js";

// @ts-ignore - the WS library is not written with TypeScript or type identity in mind
import WebSocket from "../../ws-es6/index.js";

let id:number = 0,
    frameId:string = "",
    testIndex:number = 0,
    tests:testBrowserItem[] = null;
const message = function terminal_test_message(config:browserMessageConfig):void {
        let loaderId:string = "",
            remote:string = "";
        // eslint-disable-next-line
        const list:any = JSON.parse(config.responseBody),
            sendRemote = function terminal_test_message_session_sendRemote():void {
                message.send("Page.addScriptToEvaluateOnNewDocument", {
                    source: remote
                });
            };
        tests = config.campaign.tests;
        message.ws = new WebSocket(list[0].webSocketDebuggerUrl, {perMessageDeflate: false});
        message.ws.on("open", function terminal_test_message_wsOpen():void {
            vars.node.fs.readFile(`${vars.js}lib${vars.sep}browser${vars.sep}remote.js`, function terminal_test_message_wsOpen_readRemote(readError:Error, fileData:string):void {
                if (readError === null) {
                    remote = fileData.toString().replace(/serverPort:\s+\d+,/, `serverPort: ${config.serverAddress.port},`).replace("export {}", "");
                    message.send("Network.enable");
                    message.send("Log.enable");
                    message.send("Runtime.enable");
                    message.send("Page.enable");
                    message.send("DOM.enable");
                    sendRemote();
                    message.send("Page.navigate", {
                        url: config.campaign.startPage
                    });
                } else {
                    error([readError.toString()]);
                }
            });
        });
        message.ws.on("message", function terminal_test_message_wsMessage(data:string):void {
            if (data.indexOf("{\"method\":\"Page.domContentEventFired\"") === 0 && data.indexOf(loaderId) > 0) {
                // inject code into next requested page
                sendRemote();
            } else if (data.indexOf("{\"method\":\"Page.frameStoppedLoading\"") === 0 && data.indexOf(frameId) > 0) {
                // send a test
                message.sendTest(testIndex, true);
            } else if (data.indexOf("{\"method\":\"Runtime.consoleAPICalled\"") === 0 && data.indexOf("Drial - report") > 0) {
                // reading a test result from the browser
                const result:testBrowserRoute = JSON.parse(JSON.parse(data).params.args[0].value.replace("Drial - report:", ""));
                results(result, config.campaign.tests, config.options.noClose);
            } else if (loaderId === "" && data.indexOf("{\"method\":\"Network.requestWillBeSent\"") === 0 && data.indexOf(config.campaign.startPage) > 0) {
                // grab the session identifiers when the test starts
                const payload:any = JSON.parse(data);
                frameId = payload.params.frameId;
                loaderId = payload.params.loaderId;
            }// else if (data.indexOf("{\"method\":\"Network.") !== 0) {
            //    // print out all browser messaging except network traffic
            //    console.log(data.slice(0, 250));
            //}
        });
    };
// eslint-disable-next-line
message.send = function terminal_test_message_send(method:string, params?:any):void {
    id = id + 1;
    message.ws.send(JSON.stringify({
        id: id,
        method: method,
        params: params
    }));
};
message.sendClose = function terminal_test_message_sendClose(exitType:0|1):void {
    // close the browser
    message.send("Browser.close");
    process.exit(exitType);
};
message.sendTest = function terminal_test_message_sendTest(index:number, refresh:boolean):void {
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
        expression: `window.drialRemote.parse('${JSON.stringify(route).replace(/'/g, "\\\'")}')`
    });
};
message.ws = null;

export default message;