/* lib/typescript/test.d - TypeScript interfaces used test automation. */

import { ServerResponse } from "http";
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
    interface testBrowserApplication {
        agent: string;
        args: testBrowserArgs;
        exitMessage: string;
        exitType: 0 | 1;
        index: number;
        ip: string;
        methods: {
            close: (data:testBrowserRoute) => void;
            delay: (config:testBrowserDelay) => void;
            execute: (args:testBrowserArgs) => void;
            exit: (index:number) => void;
            iterate: (index:number) => void;
            request: (item:testBrowserRoute) => void;
            ["reset-browser"]: (data:testBrowserRoute) => void;
            ["reset-complete"]: () => void;
            ["reset-request"]: (data:testBrowserRoute) => void;
            respond: (item:testBrowserRoute) => void;
            result: (item:testBrowserRoute) => void;
            route: (data:testBrowserRoute, serverResponse:ServerResponse) => void;
        };
        port: number;
        remoteAgents: number;
    }
    interface testBrowserArgs {
        callback: (message:string, failCount:number) => void;
        demo: boolean;
        mode: testBrowserMode;
        noClose: boolean;
    }
    interface testBrowserDelay {
        action: () => void;
        browser: boolean;
        delay: number;
        message: string;
    }
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
    interface testBrowserMachines {
        [key:string]: {
            [key:string]: {
                ip: string;
                port: number;
                secure: boolean;
            };
        };
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
    interface testBrowserTransfer {
        agent: string;
        ip: string;
        port: number;
    }
    interface testModalAddress {
        address: string;
        index: number;
        lastItem: string;
        machine: string;
    }
    // ------------------------------------

    // test terminal command simulations
    interface testSimulationApplication {
        execute?: (config:testExecute) => void;
        tests: testItem[];
    }
    // ------------------------------------
}
