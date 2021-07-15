/* lib/terminal/utilities/browser_launch - Stores terminal arguments necessary to launch a browser with remote debugging enabled. */

// * browser name (object key) is a proper identifier used to launch the browser as a command
// * command should be the full list of arguments associated with the given browser except port number
const browserLaunch:browserLaunch = {
    brave  : "--no-first-run --no-default-browser-check --remote-debugging-port=",
    chrome : "--no-first-run --no-default-browser-check --remote-debugging-port=",
    edge   : "--no-first-run --no-default-browser-check --remote-debugging-port=",
    firefox: "-start-debugger-server ",
    opera  : "--no-first-run --no-default-browser-check --remote-debugging-port=",
    vivaldi: "--no-first-run --no-default-browser-check --remote-debugging-port=",
};

export default browserLaunch;