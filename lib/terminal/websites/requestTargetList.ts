
/* lib/terminal/websites/requestTargetList - Get a list of pages from the browser. */

import { ClientRequest, IncomingMessage, RequestOptions } from "http";

import error from "../utilities/error.js";
import vars from "../utilities/vars.js";

const requestTargetList = function terminal_websites_requestTargetList(callback:(body:string) => void, port:number, browserName:string):void {
    const payload:RequestOptions = {
            headers: {
                "content-type": "text/plain"
            },
            host: "127.0.0.1",
            method: "GET",
            path: "/json/list",
            port: port
        },
        // issue a client request
        // the request must be http, not https, or this will fail since the browser are only listening on http
        clientRequest:ClientRequest = vars.node.http.request(payload, function terminal_websites_requestTargetList_session(response:IncomingMessage):void {
            const chunks:Buffer[] = [];
            response.setEncoding("utf8");
            response.on("data", function terminal_websites_requestTargetList_session_chunk(chunk:Buffer):void {
                chunks.push(chunk);
            });
            response.on("end", function terminal_websites_requestTargetList_session_end():void {
                const body:string = (Buffer.isBuffer(chunks[0]) === true)
                        ? Buffer.concat(chunks).toString()
                        : chunks.join("");
                callback(body);
            });
            response.on("error", function terminal_websites_requestTargetList_responseError(errorText:Error):void {
                error([errorText.toString()]);
            });
        });
    clientRequest.on("error", function terminal_websites_requestTargetList_requestError(errorRequest:Error):void {
        if (errorRequest.toString().indexOf("ECONNREFUSED") > 0) {
            error([
                `If any instances of ${vars.text.angry + browserName + vars.text.none} browser are open close them and try again.`,
                errorRequest.toString()
            ], 1);
        } else {
            error([errorRequest.toString()], 1);
        }
    });
    clientRequest.write("");
    clientRequest.end();
};

export default requestTargetList;