/* lib/terminal/websites/results - Processes test result data into output for humans to read. */

import humanTime from "../utilities/humanTime.js";
import iterate from "./iterate.js";
import log from "../utilities/log.js";
import message from "./message.js";
import vars from "../utilities/vars.js";

const results = function terminal_websites_results(item:testBrowserRoute, noClose:boolean):void {
    let a:number = 0,
        falseFlag:boolean = false,
        index:number = -1;
    const result: [boolean, string, string][] = item.result,
        length:number = result.length,
        delay:boolean = (message.tests[item.index].unit.length === 0),

        // handles the completion of a test whether a failure or 100% pass
        completion = function terminal_websites_results_completion(pass:boolean):void {
            const plural:string = (message.tests.length === 1)
                    ? ""
                    : "s",
                totalTests:number = (function terminal_websites_results_completion_total():number {
                    // gathers a total count of tests
                    let aa:number = message.tests.length,
                        bb:number = 0;
                    do {
                        aa = aa - 1;
                        bb = bb + message.tests[aa].unit.length;
                        if (message.tests[aa].delay !== undefined) {
                            bb = bb + 1;
                        }
                    } while (aa > 0);
                    return bb;
                }()),
                exit = function terminal_websites_results_completion_exit(messageText:string, exitType:0|1):void {
                    log([messageText, "\u0007"], true);
                    message.sendClose(noClose, exitType);
                };
            vars.verbose = true;
            if (pass === true) {
                const passPlural:string = (index === 1)
                    ? ""
                    : "s";
                exit(`${humanTime(false) + vars.text.green + vars.text.bold}Passed${vars.text.none} all ${totalTests} evaluations from ${index + 1} test${passPlural}.`, 0);
                return;
            }
            exit(`${humanTime(false) + vars.text.angry}Failed${vars.text.none} on test ${vars.text.angry + (index + 1) + vars.text.none}: "${vars.text.cyan + message.tests[index].name + vars.text.none}" out of ${message.tests.length} total test${plural} and ${totalTests} evaluations.`, 1);
        },

        // the summary messaging
        summary = function terminal_websites_results_summary(pass:boolean):string {
            const resultString:string = (pass === true)
                    ? `${vars.text.green}Passed`
                    : `${vars.text.angry}Failed`;
            return `${humanTime(false) + resultString} ${index + 1}: ${vars.text.none + message.tests[index].name}`;
        },

        // build a string that provides representative DOM method chain for executing in the browser console
        buildNode = function terminal_websites_results_buildNode(config:testBrowserTest, elementOnly:boolean):string {
            let b:number = 0;
            const node:browserDOM[] = config.node,
                property:string[] = config.target,
                nodeLength:number = node.length,
                propertyLength:number = property.length,
                output:string[] = (config.target[0] === "window")
                    ? []
                    : ["document"];
            if (nodeLength > 0) {
                do {
                    output.push(".");
                    output.push(node[b][0]);
                    if (node[b][1] !== null) {
                        output.push("(\"");
                        output.push(node[b][1]);
                        output.push("\")");
                    }
                    if (node[b][2] !== null) {
                        output.push("[");
                        output.push(node[b][2].toString());
                        output.push("]");
                    }
                    b = b + 1;
                } while (b < nodeLength);
            }
            if (config.type === "element" || elementOnly === true) {
                return output.join("");
            }
            if (config.type === "attribute") {
                output.push(".");
                output.push("getAttribute(\"");
                output.push(config.target[0]);
                output.push("\")");
            } else if (config.type === "property") {
                b = 0;
                do {
                    output.push(".");
                    output.push(config.target[b]);
                    b = b + 1;
                } while (b < propertyLength);
            }
            return output.join("");
        },

        // a prase builder for the various comparative failures
        testString = function terminal_websites_results_testString(pass:boolean, config:testBrowserTest):string {
            const valueStore:primitive = config.value,
                valueType:string = typeof valueStore,
                value = (valueStore === null)
                    ? "null"
                    : (valueType === "string")
                        ? `"${valueStore}"`
                        : String(valueStore),
                star:string = `   ${vars.text.angry}*${vars.text.none} `,
                resultString:string = (pass === true)
                    ? `${vars.text.green}Passed:`
                    : (config === message.tests[index].delay)
                        ? `${vars.text.angry}Failed (delay timeout):`
                        : `${vars.text.angry}Failed:`,
                qualifier:string = (config.qualifier === "begins")
                    ? (pass === true)
                        ? "begins with"
                        : `${vars.text.angry}does not begin with${vars.text.none}`
                    : (config.qualifier === "contains")
                        ? (pass === true)
                            ? "contains"
                            : `${vars.text.angry}does not contain${vars.text.none}`
                        : (config.qualifier === "ends")
                            ? (pass === true)
                                ? "ends with"
                                : `${vars.text.angry}does not end with${vars.text.none}`
                            : (config.qualifier === "greater")
                                ? (pass === true)
                                    ? "is greater than"
                                    : `${vars.text.angry}is not greater than${vars.text.none}`
                                : (config.qualifier === "is")
                                    ? (pass === true)
                                        ? "is"
                                        : `${vars.text.angry}is not${vars.text.none}`
                                    : (config.qualifier === "lesser")
                                        ? (pass === true)
                                            ? "is less than"
                                            : `${vars.text.angry}is not less than${vars.text.none}`
                                        : (config.qualifier === "not")
                                            ? (pass === true)
                                                ? "is not"
                                                : `${vars.text.angry}is${vars.text.none}`
                                            : (pass === true)
                                                ? "does not contain"
                                                : `${vars.text.angry}contains${vars.text.none}`,
                nodeString = `${vars.text.none} ${buildNode(config, false)} ${qualifier}\n${value.replace(/^"/, "").replace(/"$/, "")}`;
            return star + resultString + nodeString;
        },

        // builds out failure messaging, especially for JavaScript errors encountered through interaction
        failureMessage = function terminal_websites_results_failureMessage():void {
            if (result[a][2] === "error") {
                const error:string = result[a][1]
                    .replace("{\"file\":"   , `{\n    "${vars.text.cyan}file${vars.text.none}"   :`)
                    .replace(",\"column\":" , `,\n    "${vars.text.cyan}column${vars.text.none}" :`)
                    .replace(",\"line\":"   , `,\n    "${vars.text.cyan}line${vars.text.none}"   :`)
                    .replace(",\"message\":", `,\n    "${vars.text.cyan}message${vars.text.none}":`)
                    .replace(",\"stack\":\"", `,\n    "${vars.text.cyan}stack${vars.text.none}"  :\n        `)
                    .replace(/\\n/g, "\n        ")
                    .replace(/@http/g, "  -  http")
                    .replace(/\s*"\s*\}$/, "\n}");
                failure.push(`     ${vars.text.angry}JavaScript Error${vars.text.none}\n${error}`);
            } else if (result[a][1].indexOf("Bad test. ") === 0) {
                const segments:string[] = result[a][1].split(": [");
                failure.push(`     ${segments[0].replace("Bad test.", `${vars.text.angry}Bad test.${vars.text.none}`)}.`);
                if (segments.length > 1) {
                    failure.push(`     Provided: ${vars.text.angry}[${segments[1] + vars.text.none}`);
                }
                failure.push(`     ${vars.text.cyan + result[a][2] + vars.text.none}`);
            } else if ((delay === false && result[a][2] === buildNode(message.tests[index].unit[a], true)) || (delay === true && result[a][2] === buildNode(message.tests[index].delay, true))) {
                failure.push(`     ${vars.text.green}Actual value:${vars.text.none}\n${vars.text.cyan + result[a][1].replace(/^"/, "").replace(/"$/, "").replace(/\\"/g, "\"") + vars.text.none}`);
            } else if ((delay === false && message.tests[index].unit[a].value === null) || (delay === true && message.tests[index].delay.value === null)) {
                failure.push(`     DOM node is not null: ${vars.text.cyan + result[a][2] + vars.text.none}`);
            } else if ((delay === false && message.tests[index].unit[a].value === undefined) || (delay === true && message.tests[index].delay.value === undefined)) {
                failure.push(`     DOM node is not undefined: ${vars.text.cyan + result[a][2] + vars.text.none}`);
            } else {
                failure.push(`     DOM node is ${result[a][1]}: ${vars.text.cyan + result[a][2] + vars.text.none}`);
            }
        },
        failure:string[] = [];

    if (index < item.index) {
        index = item.index;
        if (result[0][0] === false && result[0][1] === "delay timeout") {
            failure.push(testString(false, message.tests[index].delay));
            if (message.tests[index].delay.type === "element") {
                const qualifier:string = (message.tests[index].delay.qualifier === "not")
                    ? " not"
                    : "";
                failure.push(`     DOM node is${qualifier} ${message.tests[index].delay.value}: ${vars.text.cyan + result[1][1] + vars.text.none}`);
            } else {
                failure.push(`     ${vars.text.green}Actual value:${vars.text.none}\n${vars.text.cyan + result[1][1].replace(/^"/, "").replace(/"$/, "").replace(/\\"/g, "\"") + vars.text.none}`);
            }
            falseFlag = true;
        } else if (result[0][0] === false && result[0][1].indexOf("event pageAddress requires") === 0) {
            failure.push(`${vars.text.angry + result[0][1] + vars.text.none}`);
            falseFlag = true;
        } else if (result[0][0] === false && result[0][1].indexOf("event error ") === 0) {
            failure.push(`${vars.text.angry}Failed: event node is ${result[0][1].replace("event error ", "")}`);
            failure.push(`     Specified event node is: ${vars.text.cyan + result[0][2] + vars.text.none}`);
            falseFlag = true;
        } else if (delay === true) {
            failure.push(testString(result[a][0], message.tests[index].delay));
            if (result[a][0] === false) {
                failureMessage();
                falseFlag = true;
            }
        } else {
            do {
                failure.push(testString(result[a][0], message.tests[index].unit[a]));
                if (result[a][0] === false) {
                    failureMessage();
                    falseFlag = true;
                }
                a = a + 1;
            } while (a < length);
        }

        if (falseFlag === true) {
            failure.splice(0, 0, summary(false));
            log(failure);
            completion(false);
            return;
        }
        log([summary(true)]);
        if (index + 1 < message.tests.length) {
            iterate(noClose);
        } else {
            completion(true);
        }
    }
};

export default results;