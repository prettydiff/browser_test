
/* lib/terminal/test/openBrowser - Launches the web browser with all necessary configurations in place. */

import error from "../utilities/error.js";
import listener from "./listener.js";
import server from "./server.js";
import vars from "../utilities/vars.js";

const openBrowser = function terminal_test_openBrowser(campaign:campaign, options:websitesInput, configuration:configuration):void {
    // this delay is necessary to launch the browser and allow it open before sending it commands
    const keyword:"open"|"start"|"xdg-open" = (process.platform === "darwin")
            ? "open"
            : (process.platform === "win32")
                ? "start"
                : "xdg-open",
        delayStart = function terminal_test_openBrowser_delayStart(err:Error):void {
            if (err === null) {
                const filePath:string = (configuration.browserLaunch[name].indexOf("user-data-dir=") > 0)
                        ? `${logPathChrome + vars.sep}DevToolsActivePort`
                        : logPathFirefox,
                    timeout = function terminal_test_openBrowser_delayStart_timeout():void {
                        const listenWrapper = function terminal_test_openBrowser_delayStart_timeout_listenWrapper():void {
                            listener(campaign, options, server);
                        };
                        if (options.port === 0) {
                            // at this time I don't how to read the service port from Firefox
                            if (configuration.browserLaunch[name].indexOf("-MOZ_LOG") > -1) {
                                error([
                                    `${vars.text.angry}An explicit port value must be provided for Firefox based browsers.${vars.text.none}`,
                                    `Example: ${vars.text.cyan}drial test browser:firefox port:9000${vars.text.none}`
                                ], 1);
                            } else {
                                vars.node.fs.readFile(filePath, function terminal_test_openBrowser_delayStart_chromePort(fileError:Error, fileData:Buffer):void {
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
                setTimeout(timeout, options.delay);
            } else {
                error([err.toString()], 1);
            }
        };
    let name:string = options.browser,
        logPathChrome:string = "",
        logPathFirefox:string = "";
    name = (name === null)
        ? name = campaign.browser.toLowerCase().replace(/^edge$/, "msedge")
        : name.toLowerCase().replace(/^edge$/, "msedge");
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
    // open a browser in the OS with its appropriate flags and port number
    logPathChrome = `${vars.projectPath}lib${vars.sep}logs${vars.sep}chrome`;
    logPathFirefox = `"${vars.projectPath}lib${vars.sep}logs${vars.sep}firefox${vars.sep}log" `;
    vars.node.child(`${keyword} ${name} ${configuration.browserLaunch[name].replace("--user-data-dir=\"\"", `--user-data-dir="${logPathChrome}"`).replace("-MOZ_LOG_FILE ", `-MOZ_LOG_FILE ${logPathFirefox}`) + options.port}`, delayStart);
};

export default openBrowser;