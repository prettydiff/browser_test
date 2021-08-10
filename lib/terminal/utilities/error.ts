
/* lib/terminal/utilities/error - A utility for processing and logging errors from the terminal application. */

import { arch, cpus, EOL, freemem, platform, release, totalmem } from "os";

import common from "../../common/common.js";
import humanTime from "./humanTime.js";
import vars from "./vars.js";

// uniform error formatting
const error = function terminal_utilities_error(errText:string[], exitCode?:0|1):void {
    // eslint-disable-next-line
    const logger:(input:string|object) => void = console.log,
        bell = function terminal_utilities_error_bell():void {
            humanTime(true);
            if (vars.command === "build") {
                logger("\u0007"); // bell sound
            } else {
                logger("");
            }
        },
        errorOut = function terminal_utilities_error_errorOut():void {
            const stack:string|undefined = new Error().stack.replace(/error\.js:\d+:\d+\)\r?\n/, "splitMe"),
                stackMessage:string = `${vars.text.cyan}Stack trace${vars.text.none + EOL}-----------${EOL + stack.split("splitMe")[1]}`;
            vars.flags.error = true;
            logger("");
            logger(stackMessage);
            logger("");
            logger(`${vars.text.angry}Error Message${vars.text.none}`);
            logger("------------");
            if (errText[0] === "" && errText.length < 2) {
                logger(`${vars.text.yellow}No error message supplied${vars.text.none}`);
            } else {
                errText.forEach(function terminal_utilities_error_errorOut_each(value:string):void {
                    logger(value);
                });
            }
            logger("");
            bell();
        },
        debug = function terminal_utilities_error_debug():void {
            const stack:string|undefined = new Error().stack,
                total:number = totalmem(),
                free:number = freemem();
            vars.flags.error = true;
            logger("");
            logger("---");
            logger("");
            logger("");
            logger(`# ${vars.name} - Debug Report`);
            logger("");
            logger(`${vars.text.green}## Error Message${vars.text.none}`);
            if (errText[0] === "" && errText.length < 2) {
                logger(`${vars.text.yellow}No error message supplied${vars.text.none}`);
            } else {
                logger("```");
                errText.forEach(function terminal_utilities_error_each(value:string):void {
                    // eslint-disable-next-line
                    logger(value.replace(/\u001b/g, "\\u001b"));
                });
                logger("```");
            }
            if (stack !== undefined) {
                logger("");
                logger(`${vars.text.green}## Stack Trace${vars.text.none}`);
                logger("```");
                logger(stack.replace(/\s*Error\s+/, "    "));
                logger("```");
            }
            logger("");
            logger(`${vars.text.green}## Environment${vars.text.none}`);
            logger(`* OS - **${platform()} ${release()}**`);
            logger(`* Mem - ${common.commas(total)} - ${common.commas(free)} = **${common.commas(total - free)}**`);
            logger(`* CPU - ${arch()} ${cpus().length} cores`);
            logger("");
            logger(`${vars.text.green}## Command Line Instruction${vars.text.none}`);
            logger("```");
            logger(vars.cli);
            logger("```");
            logger("");
            logger(`${vars.text.green}## Time${vars.text.none}`);
            logger("```");
            logger(humanTime(false));
            logger("```");
            logger("");
            bell();
        };
    if (process.argv.indexOf("spaces_debug") > -1) {
        debug();
    } else {
        errorOut();
    }
    if (exitCode !== undefined) {
        process.exit(exitCode);
    }
};

export default error;