
/* lib/terminal/websites/iterate - Push the next test item. */

import log from "../utilities/log.js";
import message from "./message.js";
import vars from "../utilities/vars.js";

const iterate = function terminal_websites_iterate(noClose:boolean):void {
    message.indexTest = message.indexTest + 1;

    // not writing to settings
    const logs:string[] = [
            `Test ${message.indexTest + 1} malformed: ${vars.text.angry + message.tests[message.indexTest].name + vars.text.none}`,
            ""
        ],
        // determine if non-interactive events have required matching data properties
        validate = function terminal_websites_iterate_validate():boolean {
            let a:number = 0;
            const length:number = (message.tests[message.indexTest].interaction === null)
                    ? 0
                    : message.tests[message.indexTest].interaction.length,
                eventName = function terminal_websites_iterate_validate_eventName(property:string):string {
                    return `   ${vars.text.angry}*${vars.text.none} Interaction ${a + 1} has event ${vars.text.cyan}setValue${vars.text.none} but no ${vars.text.angry + property + vars.text.none} property.`;
                };
            if (message.tests[message.indexTest].delay === undefined && message.tests[message.indexTest].unit.length < 1) {
                logs.push("Test does not contain a delay test or test instances in its test array.");
                return false;
            }
            if (length > 0) {
                do {
                    if ((message.tests[message.indexTest].interaction[a].event === "setValue" || message.tests[message.indexTest].interaction[a].event === "keydown" || message.tests[message.indexTest].interaction[a].event === "keyup") && message.tests[message.indexTest].interaction[a].value === undefined) {
                        logs.push(eventName("value"));
                    } else if (message.tests[message.indexTest].interaction[a].event === "move" && message.tests[message.indexTest].interaction[a].coords === undefined) {
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
        const prior:testBrowserEvent[] = message.tests[message.indexTest - 1].interaction;
        if (message.indexTest === 0 || (message.indexTest > 0 && (prior === null || prior.length === 0 || prior[0].event !== "refresh"))) {
            message.sendTest(message.indexTest, false);
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