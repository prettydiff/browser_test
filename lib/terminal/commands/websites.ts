
/* lib/terminal/commands/websites - A command driven wrapper for all test utilities. */

import { stat } from "fs";

import configuration from "../utilities/configuration.js";
import error from "../utilities/error.js";
import openBrowser from "../websites/openBrowser.js";
import vars from "../utilities/vars.js";

// run the test suite using the build application
const test = function terminal_commands_test():void {
    let campaign:campaign = null;
    const argv = function browser_commands_test_argv(name:optionNames | "campaign", defaultValue:boolean|number|string):boolean|number|string {
        let a:number = process.argv.length,
            value:string = "";
        if (a > 0) {
            do {
                a = a - 1;
                if (process.argv[a] === name && typeof defaultValue === "boolean") {
                    return true;
                }
                if (process.argv[a].indexOf(`${name}:`) === 0 && process.argv[a] !== `${name}:`) {
                    value = process.argv[a].slice(name.length + 1);
                    if (typeof defaultValue === "string" && value !== "") {
                        return value;
                    }
                    if (typeof defaultValue === "number" && Number(value) !== 0) {
                        return Number(value);
                    }
                    if (typeof defaultValue === "boolean") {
                        if (value === "false") {
                            return false;
                        }
                        if (value === "true") {
                            return true;
                        }
                    }
                }
            } while (a > 0);
        }
        if (name !== "campaign") {
            if (campaign !== null && campaign.options !== undefined && typeof campaign.options[name] === typeof defaultValue) {
                if (campaign.options[name] !== "" && campaign.options[name] !== 0) {
                    return campaign.options[name];
                }
            }
        }
        return defaultValue;
    },
    campaignName:string = argv("campaign", "") as string;
    vars.verbose = true;

    // evaluate if a campaign is specified
    if (campaignName === "") {
        error([
            `${vars.text.angry}A campaign name is required, but it is missing.${vars.text.none}`,
            `Example: ${vars.text.cyan}drial websites campaign:demo${vars.text.none}`
        ], 1);
    }

    configuration.campaignLocation = (configuration.campaignLocation === "")
        ? `${vars.js}campaigns${vars.sep}`
        : configuration.campaignLocation.replace(/(\/|\\)$/, vars.sep);

    stat(`${configuration.campaignLocation + campaignName}.js`, function terminal_websites_index_campaign(err:Error):void {
        if (err === null) {
            // @ts-ignore - this is working correct because es2020 is set in the tsconfig, but the ide doesn't see it
            import(`file:///${configuration.campaignLocation.replace(/\\/g, "/")}/${campaignName}.js`).then(function terminal_websites_index_campaign_promise(campaignData:campaignModule) {
                campaign = campaignData.default;
                const options:websitesInput = {
                        browser: argv("browser", "") as string,
                        campaignName: campaignName,
                        delay: argv("delay", 2000) as number,
                        devtools: argv("devtools", false) as boolean,
                        noClose: argv("noClose", false) as boolean,
                        port: argv("port", 0) as number
                    };
                openBrowser(campaign, options, configuration);
            });
        } else {
            error([
                `${vars.text.angry}There is not a campaign file of name ${campaignName} in the campaigns directory.${vars.text.none}`
            ], 1);
        }
    });
};

export default test;