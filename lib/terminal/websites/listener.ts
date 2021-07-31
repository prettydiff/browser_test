
/* lib/terminal/websites/listener - A service listener that processes input and output to the web browser. */

import { Server } from "http";
import { AddressInfo } from "net";

import requestTargetList from "./requestTargetList.js";
import message from "./message.js";

const listener = function terminal_websites_listener(campaign:campaign, options:websitesInput, server:Server):void {
    requestTargetList(function terminal_websites_listener_callback(body:string):void {
        const serverAddress:AddressInfo = server.address() as AddressInfo;
        message.application({
            campaign: campaign,
            options: options,
            responseBody: body.toString(),
            serverAddress: serverAddress
        });
    }, options.port, options.browser);
};

export default listener;