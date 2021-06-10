
/* lib/terminal/commands/get - A command driven utility to fetch resources from across the internet via HTTP method GET. */
import { IncomingMessage } from "http";

import error from "../utilities/error.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

// http(s) get function
const get = function terminal_commands_get(address:string, callback:(file:Buffer|string) => void):void {
        if (vars.command === "get") {
            address = process.argv[0];
            if (vars.verbose === true) {
                log.title("Get");
            }
        }
        if (address === undefined) {
            error([
                "The get command requires an address and that address must be in http/https scheme.",
                `Please execute ${vars.text.cyan + vars.command_instruction}commands get${vars.text.none} for examples.`
            ]);
            return;
        }
        let file:string = "";
        const scheme:"http"|"https" = (address.indexOf("https") === 0)
                ? "https"
                : "http";
        if ((/^(https?:\/\/)/).test(address) === false) {
            error([
                `Address: ${vars.text.angry + address + vars.text.none}`,
                "The get command requires an address in http/https scheme.",
                `Please execute ${vars.text.cyan + vars.command_instruction}commands get${vars.text.none} for examples.`
            ]);
            return;
        }
        // both http and https are used here as the scheme variable
        vars.node[scheme].get(address, function terminal_commands_get_callback(res:IncomingMessage) {
            res.on("data", function terminal_commands_get_callback_data(chunk:string):void {
                file = file + chunk;
            });
            res.on("end", function terminal_commands_get_callback_end() {
                if (res.statusCode !== 200) {
                    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307 || res.statusCode === 308) {
                        if (vars.verbose === true) {
                            log([`${res.statusCode} ${vars.node.http.STATUS_CODES[res.statusCode]} - ${address}`]);
                        }
                        process.argv[0] = res.headers.location;
                        address = process.argv[0];
                        terminal_commands_get(address, callback);
                        return;
                    }
                    error([`${scheme}.get failed with status code ${res.statusCode}`]);
                    return;
                }
                if (vars.command === "get") {
                    log([file.toString()]);
                } else if (callback !== null) {
                    callback(file);
                }
            });
        });
    };

export default get;