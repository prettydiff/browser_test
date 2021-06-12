/* lib/typescript/terminal.d - TypeScript interfaces used by terminal specific libraries. */

import { IncomingHttpHeaders } from "http";

declare global {
    // build
    interface buildPhaseList {
        commands:() => void;
        configurations:() => void;
        libReadme:() => void;
        lint:() => void;
        shellGlobal:() => void;
        typescript:() => void;
        version:() => void;
    }
    interface docItem {
        description: string;
        name: string;
        namePadded: string;
        path: string;
    }
    // ------------------------------------

    // commandList
    interface commandDocumentation {
        [key:string]: commandItem;
    }
    interface commandExample {
        code: string;
        defined: string;
    }
    interface commandItem {
        description: string;
        example: commandExample[];
    }
    interface commandList {
        build: (test?:boolean, callback?:() => void) => void;
        commands: () => void;
        directory: (parameters?:readDirectory) => void;
        get: (address?:string, callback?:(file:Buffer|string) => void) => void;
        lint: (callback?:(complete:string, failCount:number) => void) => void;
        mkdir: (dirToMake?:string, callback?:(typeError:string) => void) => void;
        remove: (filePath?:string, callback?:() => void) => void;
        test: () => void;
        update:() => void;
        version: () => void;
    }
    interface nodeLists {
        empty_line: boolean;
        heading: string;
        obj: commandDocumentation;
        property: "description" | "each" | "example";
        total: boolean;
    }
    // ------------------------------------

    // directory
    interface directoryData {
        atimeMs: number;
        ctimeMs: number;
        linkPath: string;
        linkType: "" | "directory" | "file";
        mode: number;
        mtimeMs: number;
        size: number;
    }
    interface directoryList extends Array<directoryItem> {
        [index:number]: directoryItem;
        failures?: string[];
    }
    interface readDirectory {
        callback: Function;
        depth: number;
        exclusions: string[];
        mode: directoryMode;
        path: string;
        search?: string;
        symbolic: boolean;
    }
    // ------------------------------------

    // error
    interface httpException extends NodeJS.ErrnoException {
        address: string;
        port: number;
    }
    // ------------------------------------

    // httpClient
    interface httpConfiguration {
        callback: (message:Buffer|string, headers:IncomingHttpHeaders) => void;
        ip: string;
        payload: Buffer|string;
        port: number;
        requestError: (error:httpException) => void;
        responseError: (error:httpException) => void;
    }
    interface httpError {
        callType: "request" | "response";
        error: NodeJS.ErrnoException;
    }
    // ------------------------------------

    // methodPOST
    interface postActions {
        [key:string]: () => void;
    }
    // ------------------------------------

    // remove
    interface removeCount {
        dirs: number;
        file: number;
        link: number;
        size: number;
    }
    // ------------------------------------
}