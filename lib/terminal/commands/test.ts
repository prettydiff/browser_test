
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
    const delay:number = (function browser_commands_test_delay():number {
            let a:number = process.argv.length,
                value:string = "";
            do {
                a = a - 1;
                if (process.argv[a].indexOf("delay:") === 0) {
                    value = process.argv[a].slice(6);
                    if (isNaN(Number(value)) === true) {
                        error([`${vars.text.angry}Delay value ${value} is not a number.${vars.text.none}`], 1);
                    }
                    return Number(value);
                }
            } while (a > 0);
            return 10000;
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
                    
                    console.log(body.length+" "+body);

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
        keyword:"start"|"open"|"xdg-open" = (process.platform === "darwin")
            ? "open"
            : (process.platform === "win32")
                ? "start"
                : "xdg-open",
        port:number = (function terminal_commands_test_port():number {
            let a:number = process.argv.length,
                value:string = "",
                numb:number = 0;
            if (a > 0) {
                do {
                    a = a - 1;
                    if (process.argv[a].indexOf("port:") === 0) {
                        value = process.argv[a].split(":")[1];
                        numb = Number(value);
                        if (isNaN(numb) === true) {
                            error([`${vars.text.angry}Specified port is not a number.${vars.text.none}`], 1);
                        }
                        if (numb < 1) {
                            error([`${vars.text.angry}Specified port is not a number greater than 0.${vars.text.none}`], 1);
                        }
                        return numb;
                    }
                } while (a > 0);
            }
            error([
                `${vars.text.angry}No port specified.${vars.text.none}`,
                `Please see this example: ${vars.text.cyan}drial test browser:firefox port:61352${vars.text.none}`,
                "Port numbers are integers in the range of 1-65535. The higher the port number the more likely it is unused."
            ], 1);
        }()),
        launch = function terminal_commands_test_browserLaunch():void {
            // this delay is necessary to launch the browser and allow it open before sending it commands
            const delayStart = function terminal_commands_test_browserLaunch_delayStart(err:Error, stdout:string, stderr:string):void {
                if (err === null) {
                    setTimeout(function terminal_commands_test_browserLaunch_delayStart_timeout():void {
                        server.listen({
                            port: 0
                        }, listener);
                    }, delay);
                } else {
                    error([err.toString()], 1);
                }
            };
            let a:number = process.argv.length,
                name:string = "";
            if (a > 0) {
                do {
                    a = a - 1;
                    if (process.argv[a].indexOf("browser:") === 0) {
                        name = process.argv[a].split("browser:")[1].toLowerCase();
                        break;
                    }
                } while (a > 0);
            }
            if (name !== "" && browserLaunch[name] === undefined) {
                error([
                    `${vars.text.angry}Specified browser ${name} is not supported.${vars.text.none}`,
                    "",
                    `${vars.text.underline}To add a new browser:${vars.text.none}`,
                    `${vars.text.angry}*${vars.text.none} Update /lib/terminal/utilities/browser_launch.ts`,
                    `${vars.text.angry}*${vars.text.none} Update /documentation/browsers.md`,
                    `${vars.text.angry}*${vars.text.none} Submit a pull request to https://github.com/prettydiff/drial`,
                ], 1);
            }
            if (name === "") {
                // find default browser
            } else {
                vars.node.child(`${keyword} ${name} ${browserLaunch[name] + port}`, delayStart);
            }
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
                            remote:string = "",
                            priorMessage: string = "";
                        const body:Buffer|string = (Buffer.isBuffer(chunks[0]) === true)
                                ? Buffer.concat(chunks)
                                : chunks.join(""),
                            list = JSON.parse(body.toString()),
                            ws = new WebSocket(list[0].webSocketDebuggerUrl, {perMessageDeflate: false}),
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
                                        url: "https://prettydiff.com/"
                                    });
                                } else {
                                    error([readError.toString()]);
                                }
                            });
                        });
                        ws.on('message', function terminal_command_test_listener_wsMessage(data:string):void {
                            if (data.indexOf("{\"method\":\"Page.domContentEventFired\"") === 0) {
                                sendRemote();
                                //send("");
                            }
                            priorMessage = data;
                            console.log(data.slice(0, 250));
                        });
                    });
                    response.on("error", function terminal_commands_test_listener_responseError(errorText:Error):void {
                        error([errorText.toString()]);
                    });
                });
    
            console.log(`Server port: ${serverAddress.port}`);
            clientRequest.on("error", function terminal_commands_test_listener_requestError(errorText:Error):void {
                error([errorText.toString()]);
            });
            clientRequest.write("");
            clientRequest.end();
        };
    launch();
};

export default test;