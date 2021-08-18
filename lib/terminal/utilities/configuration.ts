/* lib/terminal/utilities/configuration - Stores configuration values. */

// * browser name (object key) is a proper identifier used to launch the browser as a command
// * command should be the full list of arguments associated with the given browser except port number
const args:browserArgs = {
        chrome: [
            "--profile-directory=\"\"",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-popup-blocking",
            "--remote-debugging-port="
        ],
        firefox: [
            "-vvv",
            "-profile",
            "--remote-debugging-port="
        ]
    },
    configuration:configurationBrowser = {
        // campaignLocation value must point to the compiled JS file location
        campaignLocation: "",
        browser: {
            args: {
                brave   : args.chrome,
                chrome  : args.chrome,
                chromium: args.chrome,
                firefox : args.firefox,
                msedge  : args.chrome,
                opera   : args.chrome,
                vivaldi : args.chrome,
            },
            // windows -- win32
            // osx     -- darwin
            // linux   -- linux
            executable: {
                brave   : "",
                chrome  : (process.platform === "win32")
                    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
                    : "/snap/bin/chrome",
                chromium: (process.platform === "win32")
                    ? ""
                    : "/snap/bin/chromium",
                firefox : (process.platform === "win32")
                    ? "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
                    : "/usr/bin/firefox",
                msedge  : (process.platform === "win32")
                    // cspell:disable
                    ? "C:\\Windows\\SystemApps\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\\msedge.exe"
                    // cspell:enable
                    : "Macintosh HD/ Applications/ Microsoft Edge",
                opera   : (process.platform === "win32")
                    ? "C:\\Program Files\\Opera\\Launcher.exe"
                    : "",
                vivaldi : ""
            }
        }
    };

export default configuration;