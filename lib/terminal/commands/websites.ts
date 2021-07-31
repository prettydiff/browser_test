
/* lib/terminal/commands/websites - A command driven wrapper for all test utilities. */

import error from "../utilities/error.js";
import websites from "../websites/index.js";
import vars from "../utilities/vars.js";

// run the test suite using the build application
const test = function terminal_commands_test():void {
    const argv = function browser_commands_test_argv(name:string):string|null {
            let a:number = process.argv.length;
            name = name.replace(/s$/, "");
            if (a > 0) {
                do {
                    a = a - 1;
                    if (process.argv[a].indexOf(`${name}:`) === 0 && process.argv[a] !== `${name}:`) {
                        return process.argv[a].slice(name.length + 1);
                    }
                } while (a > 0);
            }
            return null;
        },
        options:websitesInput = {
            browser: argv("browser"),
            browserMessaging: (process.argv.indexOf("browserMessaging") > -1),
            campaignName: argv("campaign"),
            delay: (function browser_commands_test_delay():number {
                const value:string = argv("delay"),
                    numb:number = Number(value);
                if (value !== null && numb > 0) {
                    return numb;
                }
                return 2000;
            }()),
            devtools: (process.argv.indexOf("devtools") > -1),
            noClose: (process.argv.indexOf("browserMessaging") > -1 || process.argv.indexOf("noClose") > -1),
            port: (function terminal_commands_test_port():number {
                const value:string = argv("port"),
                    numb:number = Number(value);
                if (value === null || numb < 1) {
                    return 0;
                }
                return numb;
            }())
        };
    vars.verbose = true;

    // evaluate if a campaign is specified
    if (options.campaignName === null) {
        error([
            `${vars.text.angry}A campaign name is required, but it is missing.${vars.text.none}`,
            `Example: ${vars.text.cyan}drial websites campaign:demo${vars.text.none}`
        ], 1);
    }

    websites(options);
};

export default test;