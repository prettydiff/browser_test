
/* lib/terminal/websites/iterate - Push the next test item. */

import humanTime from "../utilities/humanTime.js";
import log from "../utilities/log.js";
import message from "./message.js";
import vars from "../utilities/vars.js";

const iterate = function terminal_websites_iterate(tests:testBrowserItem[], index:number, noClose:boolean):void {
    // not writing to settings
    let delayMessage:string = "",
        delayBrowser:boolean = false;
    const logs:string[] = [
            `Test ${index + 1} malformed: ${vars.text.angry + tests[index].name + vars.text.none}`,
            ""
        ],
        wait:number = (function terminal_websites_iterate_wait():number {
            let a:number = tests[index].interaction.length,
                value:number = 0,
                count:number = 0;
            do {
                a = a - 1;
                if (tests[index].interaction[a].event === "wait") {
                    value = Number(tests[index].interaction[a].value);
                    if (isNaN(value) === false) {
                        count = count + value;
                    }
                }
            } while (a > 0);
            value = 2000;
            if (tests[index].interaction[0].event === "refresh" && count < value) {
                delayMessage = "Providing remote machine browser time before a refresh.";
                return value;
            }
            if (count > 0) {
                delayBrowser = true;
            }
            return count;
        }()),
        waitText = function terminal_websites_iterate_waitText():string {
            return (delayMessage === "" && wait > 0)
                ? `Pausing for 'wait' event in browser.`
                : delayMessage;
        },
        // determine if non-interactive events have required matching data properties
        validate = function terminal_websites_iterate_validate():boolean {
            let a:number = 0;
            const length:number = (tests[index].interaction === null)
                    ? 0
                    : tests[index].interaction.length,
                eventName = function terminal_websites_iterate_validate_eventName(property:string):string {
                    return `   ${vars.text.angry}*${vars.text.none} Interaction ${a + 1} has event ${vars.text.cyan}setValue${vars.text.none} but no ${vars.text.angry + property + vars.text.none} property.`;
                };
            if (tests[index].delay === undefined && tests[index].unit.length < 1) {
                logs.push("Test does not contain a delay test or test instances in its test array.");
                return false;
            }
            if (length > 0) {
                do {
                    if ((tests[index].interaction[a].event === "setValue" || tests[index].interaction[a].event === "keydown" || tests[index].interaction[a].event === "keyup") && tests[index].interaction[a].value === undefined) {
                        logs.push(eventName("value"));
                    } else if (tests[index].interaction[a].event === "move" && tests[index].interaction[a].coords === undefined) {
                        logs.push(eventName("coords"));
                    }
                    a = a + 1;
                } while (a < length);
            }
            if (length === 0 || logs.length < 3) {
                return true;
            }
            return false;
        };
    // delay is necessary to prevent a race condition
    // * about 1 in 10 times this will fail following event "refresh"
    // * because serverVars.testBrowser is not updated to methodGET library fast enough
    if (validate() === true) {
        const prior:testBrowserEvent[] = tests[index - 1].interaction;
        if (index === 0 || (index > 0 && (prior === null || prior.length === 0 || prior[0].event !== "refresh"))) {
            message.sendTest(index, false);
        } else if (delayBrowser === true) {
            const second:number = (wait / 1000),
                plural:string = (second === 1)
                    ? ""
                    : "s";
            log([`${humanTime(false)}Delaying for ${vars.text.cyan + second + vars.text.none} second${plural}: ${vars.text.cyan + waitText() + vars.text.none}`]);
        }
    } else {
        vars.verbose = true;
        log(logs, true);
        if (noClose === false) {
            process.exit(1);
        }
    }
};

export default iterate;