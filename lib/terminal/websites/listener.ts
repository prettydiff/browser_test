
/* lib/terminal/websites/listener - A service listener that processes input and output to the web browser. */

import { AddressInfo } from "net";
import { ClientRequest, IncomingMessage, RequestOptions, Server } from "http";

import error from "../utilities/error.js";
import message from "./message.js";
import vars from "../utilities/vars.js";

const listener = function terminal_websites_listener(campaign:campaign, options:websitesInput, server:Server):void {
    const serverAddress:AddressInfo = server.address() as AddressInfo,
        payload:RequestOptions = {
            headers: {
                "content-type": "application/json"
            },
            host: "127.0.0.1",
            method: "GET",
            path: "/json/list",
            port: options.port
        },
        clientRequest:ClientRequest = vars.node.http.request(payload, function terminal_websites_listener_session(response:IncomingMessage):void {
            const chunks:Buffer[] = [];
            response.setEncoding("utf8");
            response.on("data", function terminal_websites_listener_session_chunk(chunk:Buffer):void {
                chunks.push(chunk);
            });
            response.on("end", function terminal_websites_listener_session_end():void {
                const body:Buffer|string = (Buffer.isBuffer(chunks[0]) === true)
                        ? Buffer.concat(chunks)
                        : chunks.join("");
                message({
                    campaign: campaign,
                    options: options,
                    responseBody: body.toString(),
                    serverAddress: serverAddress
                });
            });
            response.on("error", function terminal_websites_listener_responseError(errorText:Error):void {
                error([errorText.toString()]);
            });
        });
    clientRequest.on("error", function terminal_websites_listener_requestError(errorText:Error):void {
        error([errorText.toString()]);
    });
    clientRequest.write("");
    clientRequest.end();
};

export default listener;