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
    interface targetList {
        [key: string]: targetListItem[];
    }
    interface targetListItem {
        description: string;
        devtoolsFrontendUrl: string;
        faviconUrl: string;
        id: string;
        parentId: string;
        title: string;
        type: "background_page" | "iframe" | "other" | "page";
        url: string;
        webSocketDebuggerUrl: string;
    }
    // ------------------------------------

    // test application
    interface testComplete {
        callback: Function;
        fail: number;
        testType: testListType | "selected";
        total: number;
    }
    interface testEvaluation {
        callback: Function;
        fail: number;
        index: number;
        list: number[];
        test: testItem;
        testType: "service" | "simulation";
        values: [string, string, string];
    }
    interface testExecute {
        complete: Function;
        fail: number;
        index: number;
        list: number[];
    }
    interface testItem {
        artifact?: string;
        command: string;
        file?: string;
        qualifier: qualifier | qualifierFile;
        test: string;
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

    // test terminal command simulations
    interface testSimulationApplication {
        execute?: (config:testExecute) => void;
        tests: testItem[];
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
