
/* lib/terminal/websites/openBrowser - Launches the web browser with all necessary configurations in place. */

import { ChildProcess } from "child_process";

import error from "../utilities/error.js";
import listener from "./listener.js";
import log from "../utilities/log.js";
import server from "./server.js";
import vars from "../utilities/vars.js";

const openBrowser = function terminal_websites_openBrowser(campaign:campaign, options:websitesInput, configuration:configuration):void {
    // this delay is necessary to launch the browser and allow it open before sending it commands
    options.browser = (options.browser === null)
        ? campaign.browser.toLowerCase().replace(/^edge$/, "msedge")
        : options.browser.toLowerCase().replace(/^edge$/, "msedge");
    if (configuration.browser.executable[options.browser] === undefined) {
        error([
            `${vars.text.angry}Browser name ${options.browser} does not exist in the configuration.${vars.text.none}`,
            `1. Please add ${vars.text.green + vars.text.bold + options.browser + vars.text.none} to the "execution" object of /lib/utilities/configuration.ts.`,
            `2. Execute command: ${vars.text.cyan}drial build${vars.text.none}`,
            `3. Run your test again.`
        ], 1);
    }
    if (configuration.browser.executable[options.browser] === "") {
        error([
            `The ${vars.text.angry}execution path is not defined${vars.text.none} for browser ${vars.text.green + vars.text.bold + options.browser + vars.text.none}.`,
            `1. Please find the file system path to browser ${options.browser} on your computer.`,
            `2. Add that file system path to the "execution" object of /lib/utilities/configuration.ts`,
            `3. Execute command: ${vars.text.cyan}drial build${vars.text.none}`,
            `4. Run your test again.`
        ], 1);
    }
    const chrome:boolean = (configuration.browser.args[options.browser].indexOf("-vvv") < 0),
        timeout = function terminal_websites_openBrowser_timeout():void {
            const listenWrapper = function terminal_websites_openBrowser_timeout_listenWrapper():void {
                listener(campaign, options, server);
            };
            log([`Browser port: ${vars.text.green + vars.text.bold + options.port + vars.text.none}`]);
            server.listen({
                port: 0
            }, listenWrapper);
        },
        // open a browser in the OS with its appropriate flags and port number
        args = (function terminal_websites_openBrowser_chrome():string[] {
            // unsupported browser
            if (configuration.browser.args[options.browser] === undefined || configuration.browser.executable[options.browser] === undefined || configuration.browser.executable[options.browser] === "") {
                error([
                    `${vars.text.angry}Specified browser ${options.browser} is not supported.${vars.text.none}`,
                    "",
                    `${vars.text.underline}To add a new browser:${vars.text.none}`,
                    `${vars.text.angry}*${vars.text.none} Update /lib/terminal/utilities/browser_launch.ts`,
                    `${vars.text.angry}*${vars.text.none} Update /documentation/browsers.md`,
                    `${vars.text.angry}*${vars.text.none} Submit a pull request to https://github.com/prettydiff/drial`,
                ], 1);
            }
            configuration.browser.args[options.browser][configuration.browser.args[options.browser].indexOf("--remote-debugging-port=")] = `--remote-debugging-port=${options.port.toString()}`;
            configuration.browser.args[options.browser].splice(0, 0, "about:blank");
            if (chrome === true) {
                if (options.devtools === true) {
                    configuration.browser.args[options.browser].push("--auto-open-devtools-for-tabs");
                }
            } else {
                if (options.devtools === true) {
                    configuration.browser.args[options.browser].push("--devtools");
                }
            }
            return configuration.browser.args[options.browser];
        }()),
        spawn:ChildProcess = vars.node.spawn(`"${configuration.browser.executable[options.browser]}"`, args, {
            cwd: vars.projectPath,
            shell: true
        });

    spawn.stderr.on("data", function terminal_websites_openBrowser_spawnStderr(data:Buffer):void {
        let str:string = data.toString();
        if (str.indexOf("DevTools listening on ws") > -1) {
            // grab the dynamic port for chrome type browsers
            str = str.slice(str.indexOf(":") + 1);
            str = str.slice(str.indexOf(":") + 1);
            str = str.slice(0, str.indexOf("/"));
            options.port = Number(str);
        } else if (str.indexOf("Unable to move the cache: Access is denied.") > -1) {
            // error about profile violations in chrome
            error([
                `${vars.text.angry}Browser profile conflict.${vars.text.none}`,
                `Close all instances of browser ${vars.text.cyan + options.browser + vars.text.none} and try again.`
            ], 1);
        }
    });

    spawn.stdout.on("data", function terminal_websites_openBrowser_spawnStdout(data:Buffer):void {
        let str:string = data.toString();
        if (str.indexOf("DBG-SERVER: Socket listening on: ") > -1) {
            // grab the dynamic port for firefox type browsers
            str = str.replace("DBG-SERVER:", "").replace(/\s+/g, "");
            str = str.slice(str.indexOf(":") + 1);
            options.port = Number(str);
        } else if (str.indexOf("ERROR") > 0) {
            error([
                `${vars.text.angry}Error reported by browser ${options.browser} to stdout.${vars.text.none}`,
                str
            ], 1);
        }
    });

    setTimeout(timeout, options.delay);
};

export default openBrowser;