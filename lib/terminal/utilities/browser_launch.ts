/* lib/terminal/utilities/browser_launch - Stores terminal arguments necessary to launch a browser with remote debugging enabled. */

// * browser name (object key) is a proper identifier used to launch the browser as a command
// * command should be the full list of arguments associated with the given browser except port number
const chrome:string = `--user-data-dir="" --enable-logging --v=0 --no-first-run --no-default-browser-check --remote-debugging-port=`,
    firefox:string = "-MOZ_LOG_FILE -MOZ_LOG \"timestamp,rotate:200,nsSocketTransport:5\" -start-debugger-server ",
    browserLaunch:browserLaunchList = {
        brave  : chrome,
        chrome : chrome,
        firefox: firefox,
        // cspell:disable
        msedge : chrome,
        // cspell:enable
        opera  : chrome,
        vivaldi: chrome,
    };

export default browserLaunch;