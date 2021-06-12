/* lib/typescript/test.d - TypeScript interfaces used test automation. */

import { ServerResponse } from "http";
declare global {

    // test application
    interface serverOutput {
        agent: string;
        agentType: agentType;
        server: httpServer;
        webPort: number;
        wsPort: number;
    }
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
        test: testItem | testService;
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
    interface testTypeCollection {
        service: testServiceApplication;
        simulation: testSimulationApplication;
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
        machine: string;
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
        transfer: testBrowserTransfer;
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

    // test services
    interface testServiceApplication {
        addServers?: (callback:Function) => void;
        execute?: (config:testExecute) => void;
        killServers?: (complete:testComplete) => void;
        populate?:() => void;
        serverRemote: {
            device: {
                [key:string]: httpServer;
            };
            user: {
                [key:string]: httpServer;
            };
        };
        tests?: testService[];
    }
    interface testServiceShares {
        local?: agentShares;
        remote?: agentShares;
    }
    interface testServiceSettings {
        "settings": {
            data: agents | ui_data;
            response: ServerResponse;
            type: settingsType;
        };
    }
    interface testService {
        artifact?: string;
        command: heartbeat | invite | settings | systemDataCopy | systemDataFile | testServiceSettings;
        file?: string;
        name: string;
        qualifier: qualifier;
        requestType: requestType;
        shares?: testServiceShares;
        test: fileStatusMessage | fsDetails | heartbeat | stringData[] | string;
    }
    // ------------------------------------

    // test terminal command simulations
    interface testSimulationApplication {
        execute?: (config:testExecute) => void;
        tests: testItem[];
    }
    // ------------------------------------
}
