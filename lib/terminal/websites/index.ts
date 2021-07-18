
/* lib/terminal/websites/index - The code that allows testing of websites. */

import configuration from "../utilities/configuration.js";
import error from "../utilities/error.js";
import openBrowser from "./openBrowser.js";
import vars from "../utilities/vars.js";

const websites = function terminal_websites_index(options:websitesInput):void {
    let campaign:campaign = null;

    // get the test campaign file
    configuration.campaignLocation = (configuration.campaignLocation === "")
        ? `${vars.js}campaigns`
        : configuration.campaignLocation.replace(/(\/|\\)$/, "");
    vars.node.fs.stat(`${configuration.campaignLocation + vars.sep + options.campaignName}.js`, function terminal_websites_index_campaign(err:Error):void {
        if (err === null) {
            // @ts-ignore - this is working correct because es2020 is set in the tsconfig, but the ide doesn't see it
            import(`file:///${configuration.campaignLocation.replace(/\\/g, "/")}/${options.campaignName}.js`).then(function terminal_websites_index_campaign_promise(campaignData:campaignModule) {
                campaign = campaignData.default;
                openBrowser(campaign, options, configuration);
            });
        } else {
            error([
                `${vars.text.angry}There is not a campaign file of name ${options.campaignName} in the campaigns directory.${vars.text.none}`
            ], 1);
        }
    });
};

export default websites;