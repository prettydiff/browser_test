
/* lib/terminal/commands/test - A command driven wrapper for all test utilities. */
import browser from "../modes/browser.js";
import log from "../utilities/log.js";

// run the test suite using the build application
const test = function terminal_commands_test():void {
    const parameters = {
        browser: "default",
        mode: "browser"
    };
    let a:number = process.argv.length,
        arg:string[];
    do {
        a = a - 1;
        arg = process.argv[a].split(":");
        if (arg[0] === "mode" && (arg[1] === "command" || arg[1] === "service")) {
            parameters.mode = arg[1];
        } else if (arg[0] === "browser") {
            parameters.browser = arg[1];
        }
    } while (a > 0);
    log.title("drial Tests", true);
    if (parameters.mode === "browser") {
        browser();
    }
};

export default test;