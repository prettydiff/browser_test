
/* lib/terminal/commands/test - A command driven wrapper for all test utilities. */

import { ClientRequest, IncomingMessage, RequestOptions, Server, ServerResponse } from "http";
import { AddressInfo } from "net";
import { Readable } from "stream";
import { StringDecoder } from "string_decoder";

import browserLaunch from "../utilities/browser_launch.js";
import error from "../utilities/error.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

// @ts-ignore - the WS library is not written with TypeScript or type identity in mind
import WebSocket from "../../ws-es6/index.js";

// run the test suite using the build application
const test = function terminal_commands_test():void {
    const argv = function browser_commands_test_argv(name:string):string|null {
            let a:number = process.argv.length;
            do {
                a = a - 1;
                if (process.argv[a].indexOf(`${name}:`) === 0 && process.argv[a] !== `${name}:`) {
                    return process.argv[a].slice(name.length + 1);
                }
            } while (a > 0);
            return null;
        },
        delay:number = (function browser_commands_test_delay():number {
            const value:string = argv("delay"),
                numb:number = Number(value);
            if (value !== null && numb > 0) {
                return numb;
            }
            return 5000;
        }()),
        server:Server = vars.node.http.createServer(function terminal_commands_test_server(request:IncomingMessage, serverResponse:ServerResponse):void {
            let body:string = "",
                ended:boolean = false;
            const decoder:StringDecoder = new StringDecoder("utf8"),
                contentLength:number = Number(request.headers["content-length"]),
                requestData = function terminal_commands_test_server_requestData(data:Buffer):void {
                    body = body + decoder.write(data);
                    if (body.length > contentLength) {
                        request.destroy({
                            name: "TOO_LARGE",
                            message: "Request destroyed for size in excess of its content-length header."
                        });
                    }
                },
                requestEnd = function terminal_commands_test_server_requestEnd():void {
                    const message:string = `Response from terminal. Request body size: ${body.length}`,
                        readStream:Readable = vars.node.stream.Readable.from(message);
                    ended = true;

                    serverResponse.setHeader("cache-control", "no-store");
                    serverResponse.setHeader("alt-svc", "clear");
                    serverResponse.setHeader("connection", "keep-alive");
                    serverResponse.setHeader("content-length", Buffer.byteLength(message));
                    serverResponse.setHeader("referrer-policy", "no-referrer");
                    // cspell:disable
                    serverResponse.setHeader("x-content-type-options", "nosniff");
                    // cspell:enable
                    serverResponse.writeHead(200, {"content-type": "text/plain"});
                    readStream.pipe(serverResponse);
                },
                requestError = function terminal_commands_test_server_requestError(errorMessage:NodeJS.ErrnoException):void {
                    const errorString:string = errorMessage.toString();
                    if (errorMessage.code !== "ETIMEDOUT" && (ended === false || (ended === true && errorString !== "Error: aborted"))) {
                        log([
                            `${vars.text.cyan}POST request, ${request.headers["request-type"]}, methodPOST.ts${vars.text.none}`,
                            body.slice(0, 1024),
                            "",
                            `body length: ${body.length}`,
                            vars.text.angry + errorString + vars.text.none,
                            "",
                            ""
                        ]);
                    }
                };
            request.on("data", requestData);
            request.on("end", requestEnd);
            request.on("error", requestError);
        }),
        keyword:"open"|"start"|"xdg-open" = (process.platform === "darwin")
            ? "open"
            : (process.platform === "win32")
                ? "start"
                : "xdg-open",
        launch = function terminal_commands_test_browserLaunch(campaign:campaign):void {
            // this delay is necessary to launch the browser and allow it open before sending it commands
            const delayStart = function terminal_commands_test_browserLaunch_delayStart(err:Error):void {
                if (err === null) {
                    const filePath:string = (browserLaunch[name].indexOf("user-data-dir=") > 0)
                            ? `${logPathChrome + vars.sep}DevToolsActivePort`
                            : logPathFirefox,
                        timeout = function terminal_commands_test_browserLaunch_delayStart_timeout():void {
                            if (port === 0) {
                                // at this time I don't how to read the service port from Firefox
                                if (browserLaunch[name].indexOf("-MOZ_LOG") > -1) {
                                    error([
                                        `${vars.text.angry}An explicit port value must be provided for Firefox based browsers.${vars.text.none}`,
                                        `Example: ${vars.text.cyan}drial test browser:firefox port:9000${vars.text.none}`
                                    ], 1);
                                } else {
                                    vars.node.fs.readFile(filePath, function terminal_commands_test_browserLaunch_delayStart_chromePort(fileError:Error, fileData:Buffer):void {
                                        if (fileError === null) {
                                            port = Number(fileData.toString().split("\n")[0]);
                                            server.listen({
                                                port: 0
                                            }, listener);
                                        } else {
                                            error([fileError.toString()], 1);
                                        }
                                    });
                                }
                            } else {
                                server.listen({
                                    port: 0
                                }, listener);
                            }
                        };
                    setTimeout(timeout, delay);
                } else {
                    error([err.toString()], 1);
                }
            };
            let name:string = argv("browser"),
                logPathChrome:string = "",
                logPathFirefox:string = "";
            name = (name === null)
                ? name = campaign.browser.toLowerCase().replace(/^edge$/, "msedge")
                : name.toLowerCase().replace(/^edge$/, "msedge");
            if (browserLaunch[name] === undefined) {
                error([
                    `${vars.text.angry}Specified browser ${name} is not supported.${vars.text.none}`,
                    "",
                    `${vars.text.underline}To add a new browser:${vars.text.none}`,
                    `${vars.text.angry}*${vars.text.none} Update /lib/terminal/utilities/browser_launch.ts`,
                    `${vars.text.angry}*${vars.text.none} Update /documentation/browsers.md`,
                    `${vars.text.angry}*${vars.text.none} Submit a pull request to https://github.com/prettydiff/drial`,
                ], 1);
            }
            // open a browser in the OS with its appropriate flags and port number
            logPathChrome = `${vars.projectPath}lib${vars.sep}logs${vars.sep}chrome`;
            logPathFirefox = `"${vars.projectPath}lib${vars.sep}logs${vars.sep}firefox${vars.sep}log" `;
            vars.node.child(`${keyword} ${name} ${browserLaunch[name].replace("--user-data-dir=\"\"", `--user-data-dir="${logPathChrome}"`).replace("-MOZ_LOG_FILE ", `-MOZ_LOG_FILE ${logPathFirefox}`) + port}`, delayStart);
        },
        listener = function terminal_commands_test_listener():void {
            const serverAddress:AddressInfo = server.address() as AddressInfo,
                payload:RequestOptions = {
                    headers: {
                        "content-type": "application/json"
                    },
                    host: "127.0.0.1",
                    method: "GET",
                    path: "/json/list",
                    port: port
                },
                clientRequest:ClientRequest = vars.node.http.request(payload, function terminal_commands_test_listener_session(response:IncomingMessage):void {
                    const chunks:Buffer[] = [];
                    response.setEncoding("utf8");
                    response.on("data", function terminal_commands_test_listener_session_chunk(chunk:Buffer):void {
                        chunks.push(chunk);
                    });
                    response.on("end", function terminal_commands_test_listener_session_end():void {
                        let id:number = 0,
                            remote:string = "";
                        const body:Buffer|string = (Buffer.isBuffer(chunks[0]) === true)
                                ? Buffer.concat(chunks)
                                : chunks.join(""),
                            list = JSON.parse(body.toString()),
                            ws = new WebSocket(list[0].webSocketDebuggerUrl, {perMessageDeflate: false}),
                            // eslint-disable-next-line
                            send = function terminal_commands_test_listener_session_send(method:string, params?:any):void {
                                id = id + 1;
                                ws.send(JSON.stringify({
                                    id: id,
                                    method: method,
                                    params: params
                                }));
                            },
                            sendRemote = function terminal_commands_test_listener_session_sendRemote():void {
                                send("Page.addScriptToEvaluateOnNewDocument", {
                                    source: remote
                                });
                            };
                        ws.on("open", function terminal_command_test_listener_wsOpen():void {
                            vars.node.fs.readFile(`${vars.js}lib${vars.sep}browser${vars.sep}remote.js`, function terminal_command_test_listener_wsOpen_readRemote(readError:Error, fileData:string):void {
                                if (readError === null) {
                                    remote = fileData.toString().replace(/serverPort:\s+\d+,/, `serverPort: ${serverAddress.port},`).replace("export {}", "");
                                    send("Network.enable");
                                    send("Log.enable");
                                    send("Runtime.enable");
                                    send("Page.enable");
                                    send("DOM.enable");
                                    sendRemote();
                                    send("Page.navigate", {
                                        url: campaign.startPage
                                    });
                                } else {
                                    error([readError.toString()]);
                                }
                            });
                        });
                        ws.on("message", function terminal_command_test_listener_wsMessage(data:string):void {
                            if (data.indexOf("{\"method\":\"Page.domContentEventFired\"") === 0 && data.indexOf(loaderId) > 0) {
                                // inject code into next requested page
                                sendRemote();
                            } else if (data.indexOf("{\"method\":\"Page.frameStoppedLoading\"") === 0 && data.indexOf(frameId) > 0) {
                                // send a test
                                const route:testBrowserRoute = {
                                    action: "result",
                                    exit: null,
                                    index: testIndex,
                                    result: null,
                                    test: campaign.tests[testIndex]
                                };
                                send("Runtime.evaluate", {
                                    expression: `window.drialRemote.parse('${JSON.stringify(route)}')`
                                });
                            } else if (data.indexOf("{\"method\":\"Runtime.consoleAPICalled\"") === 0 && data.indexOf("Drial - report") > 0) {
                                // reading a test result from the browser
                                const result:testBrowserRoute = JSON.parse(JSON.parse(data).params.args[0].value.replace("Drial - report:", ""));
                                console.log(result);
                            } else if (loaderId === "" && data.indexOf("{\"method\":\"Network.requestWillBeSent\"") === 0 && data.indexOf(campaign.startPage) > 0) {
                                // grab the session identifiers when the test starts
                                const payload:any = JSON.parse(data);
                                frameId = payload.params.frameId;
                                loaderId = payload.params.loaderId;
                            }
                            //if (data.indexOf("{\"method\":\"Network.") !== 0){console.log(data.slice(0, 250));}
                        });
                    });
                    response.on("error", function terminal_commands_test_listener_responseError(errorText:Error):void {
                        error([errorText.toString()]);
                    });
                });
            clientRequest.on("error", function terminal_commands_test_listener_requestError(errorText:Error):void {
                error([errorText.toString()]);
            });
            clientRequest.write("");
            clientRequest.end();
        },
        campaignName:string = argv("campaign");

    // evaluate the optional port argument
    let port:number = (function terminal_commands_test_port():number {
            const value:string = argv("port"),
                numb:number = Number(value);
            if (value === null || numb < 1) {
                return 0;
            }
            return numb;
        }()),
        testIndex:number = 0,
        frameId:string = "",
        loaderId:string = "",
        campaign:campaign = null;

    // evaluate if a campaign is specified
    if (campaignName === null) {
        error([
            `${vars.text.angry}A campaign name is required, but it is missing.${vars.text.none}`,
            `Example: ${vars.text.cyan}drial test campaign:demo${vars.text.none}`
        ], 1);
    }

    // get the test campaign file
    vars.node.fs.stat(`${vars.js}campaigns${vars.sep + campaignName}.js`, function terminal_commands_test_campaign(err:Error):void {
        if (err === null) {
            // @ts-ignore - this is working correct because es2020 is set in the tsconfig, but the ide doesn't see it
            import(`file:///${vars.js.replace(/\\/g, "/")}campaigns/${campaignName}.js`).then(function terminal_commands_test_campaign_promise(campaignData:campaignModule) {
                campaign = campaignData.default;
                launch(campaign);
            });
        } else {
            error([
                `${vars.text.angry}There is not a campaign file of name ${campaignName} in the campaigns directory.${vars.text.none}`
            ], 1);
        }
    });
};

export default test;