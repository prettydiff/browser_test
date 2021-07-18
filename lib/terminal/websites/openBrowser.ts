
/* lib/terminal/websites/openBrowser - Launches the web browser with all necessary configurations in place. */

import error from "../utilities/error.js";
import listener from "./listener.js";
import server from "./server.js";
import vars from "../utilities/vars.js";

const openBrowser = function terminal_websites_openBrowser(campaign:campaign, options:websitesInput, configuration:configuration):void {
    // this delay is necessary to launch the browser and allow it open before sending it commands
    const keyword:"open"|"start"|"xdg-open" = (process.platform === "darwin")
            ? "open"
            : (process.platform === "win32")
                ? "start"
                : "xdg-open",

        // wrapper for a setTimeout to ensure the browser is open before issuing commands
        delayStart = function terminal_websites_openBrowser_delayStart(err:Error):void {
            if (err === null) {
                const filePath:string = (chrome === true)
                        ? `${chromeLogs + vars.sep}DevToolsActivePort`
                        : firefoxLogs,
                    timeout = function terminal_websites_openBrowser_delayStart_timeout():void {
                        const listenWrapper = function terminal_websites_openBrowser_delayStart_timeout_listenWrapper():void {
                            listener(campaign, options, server);
                        };
                        if (options.port === 0) {
                            // at this time I don't how to read a dynamic service port from Firefox
                            if (configuration.browserLaunch[name].indexOf("-MOZ_LOG") > -1) {
                                error([
                                    `${vars.text.angry}An explicit port value must be provided for Firefox based browsers.${vars.text.none}`,
                                    `Example: ${vars.text.cyan}drial websites browser:firefox port:9000${vars.text.none}`,
                                    `For more guidance on the ${vars.text.green}websites${vars.text.none} command execute: ${vars.text.cyan}drial commands websites${vars.text.none}`
                                ], 1);
                            } else {
                                vars.node.fs.readFile(filePath, function terminal_websites_openBrowser_delayStart_chromePort(fileError:Error, fileData:Buffer):void {
                                    if (fileError === null) {
                                        options.port = Number(fileData.toString().split("\n")[0]);
                                        server.listen({
                                            port: 0
                                        }, listenWrapper);
                                    } else {
                                        error([fileError.toString()], 1);
                                    }
                                });
                            }
                        } else {
                            server.listen({
                                port: 0
                            }, listenWrapper);
                        }
                    };
                // the actual delay
                setTimeout(timeout, options.delay);
            } else {
                error([err.toString()], 1);
            }
        },
        name:string = (options.browser === null)
            ? campaign.browser.toLowerCase().replace(/^edge$/, "msedge")
            : options.browser.toLowerCase().replace(/^edge$/, "msedge"),
        chromeLogs:string = `${vars.projectPath}lib${vars.sep}logs${vars.sep}chrome`,
        firefoxLogs:string = `${vars.projectPath}lib${vars.sep}logs${vars.sep}firefox${vars.sep}log`,
        chrome:boolean = (configuration.browserLaunch[name].indexOf("--user-data-dir=") === 0),
        // open a browser in the OS with its appropriate flags and port number
        browserCommand = (function terminal_websites_openBrowser_chrome():string {
            const base:string = (chrome === true)
                ? (options.devtools === true)
                    ? `--auto-open-devtools-for-tabs ${configuration.browserLaunch[name].replace("--user-data-dir=\"\"", `--user-data-dir="${chromeLogs}"`)}`
                    : configuration.browserLaunch[name].replace("--user-data-dir=\"\"", `--user-data-dir="${chromeLogs}"`)
                : (options.devtools === true)
                    ? `--devtools ${configuration.browserLaunch[name].replace("-MOZ_LOG_FILE ", `-MOZ_LOG_FILE "${firefoxLogs}" `)}`
                    : configuration.browserLaunch[name].replace("-MOZ_LOG_FILE ", `-MOZ_LOG_FILE "${firefoxLogs}" `);
            return `${keyword} ${name} ${base + options.port}`;
        }());

    // unsupported browser
    if (configuration.browserLaunch[name] === undefined) {
        error([
            `${vars.text.angry}Specified browser ${name} is not supported.${vars.text.none}`,
            "",
            `${vars.text.underline}To add a new browser:${vars.text.none}`,
            `${vars.text.angry}*${vars.text.none} Update /lib/terminal/utilities/browser_launch.ts`,
            `${vars.text.angry}*${vars.text.none} Update /documentation/browsers.md`,
            `${vars.text.angry}*${vars.text.none} Submit a pull request to https://github.com/prettydiff/drial`,
        ], 1);
    }
    vars.node.child(browserCommand, delayStart);
};

export default openBrowser;