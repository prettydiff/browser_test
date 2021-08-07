/* lib/typescript/test.d - TypeScript interfaces used test automation. */

import { AddressInfo } from "net";

declare global {
    // campaigns
    interface campaign {
        startPage: string;
        browser: browser;
        port: number;
        tests: testBrowserItem[];
    }
    interface campaignModule {
        default: campaign;
    }
    // ------------------------------------

    // message
    interface browserMessageConfig {
        campaign: campaign;
        options: websitesInput;
        responseBody: string;
        serverAddress: AddressInfo;
    }
    interface messageItem {
        id: number;
        method: string;
        // eslint-disable-next-line
        params?: any;
    }
    interface messageModule {
        activePage: number;
        application: (config:browserMessageConfig) => void;
        indexMessage: number;
        indexTest: number;
        messageQueue: messageItem[];
        send: () => void;
        sendClose: (noClose:boolean, exitType:0|1) => void;
        sendTest: (testIndex:number, refresh:boolean) => void;
        // eslint-disable-next-line
        sendToQueue: (method:string, params:any) => void;
        switchPage: (pageIndex:number, newPage:boolean) => void;
        targets: targetList;
    }
    interface targetList {
        [key: string]: targetListItem[];
    }
    interface targetListItem {
        description: string;
        devtoolsFrontendUrl: string;
        faviconUrl: string;
        id: string;
        parentId: string;
        targetId?: string;
        title: string;
        type: "background_page" | "iframe" | "other" | "page";
        url: string;
        webSocketDebuggerUrl: string;
        // eslint-disable-next-line
        ws?: any;
    }
    // ------------------------------------

    // test in browser
    interface testBrowserDOM extends Array<browserDOM> {
        nodeString?: string;
    }
    interface testBrowserEvent {
        coords?: [number, number];
        event: eventName;
        node: testBrowserDOM;
        value?: string;
    }
    interface testBrowserItem {
        delay?: testBrowserTest;
        interaction: testBrowserEvent[];
        name: string;
        page: number;
        unit: testBrowserTest[];
    }
    interface testBrowserRoute {
        action: testBrowserAction;
        exit: string;
        index: number;
        result: [boolean, string, string][];
        test: testBrowserItem;
    }
    interface testBrowserTest {
        node: testBrowserDOM;
        qualifier: qualifier;
        target: string[];
        type: "attribute" | "element" | "property";
        value: boolean | number | string | null;
    }
    // ------------------------------------

    // websites
    interface websitesInput {
        browser: string;
        browserMessaging: boolean;
        campaignName: string;
        delay:number;
        devtools: boolean;
        noClose: boolean;
        port: number;
    }
    // ------------------------------------
}
