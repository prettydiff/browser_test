/* lib/terminal/utilities/configuration - Stores configuration values. */

// * browser name (object key) is a proper identifier used to launch the browser as a command
// * command should be the full list of arguments associated with the given browser except port number
const chrome:string = "--user-data-dir=\"\" --enable-logging --v=0 --no-first-run --no-default-browser-check --remote-debugging-port=",
    firefox:string = "-MOZ_LOG_FILE -MOZ_LOG \"timestamp,rotate:200,nsSocketTransport:5\" -start-debugger-server ",
    configuration:configuration = {
        // campaignLocation value must point to the compiled JS file location
        campaignLocation: "",
        browserLaunch: {
            brave  : chrome,
            chrome : chrome,
            firefox: firefox,
            msedge : chrome,
            opera  : chrome,
            vivaldi: chrome,
        }
    };

export default configuration;