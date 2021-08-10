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
        copy: (params?:copyParams) => void;
        directory: (parameters?:readDirectory) => void;
        lint: (callback?:(complete:string, failCount:number) => void) => void;
        makeDir: (dirToMake?:string, callback?:(typeError:string) => void) => void;
        remove: (filePath?:string, callback?:() => void) => void;
        request: (address?:string, callback?:(file:Buffer|string) => void) => void;
        update:() => void;
        version: () => void;
        websites: () => void;
    }
    interface nodeLists {
        empty_line: boolean;
        heading: string;
        obj: commandDocumentation;
        property: "description" | "each" | "example";
        total: boolean;
    }
    // ------------------------------------

    // configuration - lib/utilities/configuration.ts - browser configuration settings
    interface browserArgs {
        [key:string]: string[];
    }
    interface configurationBrowser {
        campaignLocation: string;
        browser: {
            args: {
                [key:string]: string[];
            };
            executable: {
                [key:string]: string;
            };
        };
    }
    // ------------------------------------

    // configurations - lib/configurations.json - global application environment rules
    interface configurationApplication {
        // cspell:disable
        ".eslintignore": string[];
        // cspell:enable
        "eslintrc.json": {
            env: {
                [key:string]: boolean;
            };
            extends: string;
            parser: string;
            parserOptions: {
                ecmaVersion: number;
                sourceType: "module";
            }
            plugins: string[];
            root: boolean;
            rules: {
                [key:string]: 0 | eslintCustom | eslintDelimiter | boolean | string[];
            }
        }
        ".gitignore": string[];
        "package-lock.json": {
            name: string;
            version: string;
            lockfileVersion: number;
            requires: boolean;
            dependencies: {
                [key:string]: {
                    integrity: string;
                    resolved: string;
                    version: string;
                }
            }
            devDependencies: {
                [key:string]: string;
            }
        }
    }
    interface eslintDelimiterItem {
        [key:string]: {
            delimiter: string;
            requireLast: boolean;
        }
    }
    interface packageJSON {
        author: string;
        bin: string;
        bugs: {
            [key:string]: string;
        };
        command: string;
        description: string;
        devDependencies: {
            [key:string]: string;
        };
        directories: {
            [key:string]: string;
        };
        keywords: string[];
        license: string;
        main: string;
        name: string;
        repository: {
            type: string;
            url: string;
        };
        scripts: {
            [key:string]: string;
        };
        type: "module";
        version: string;
    }
    // ------------------------------------

    // copy
    interface copyLog {
        file: boolean;
        link: boolean;
        makeDir: boolean;
    }
    interface copyStats {
        dirs: number;
        error: number;
        files: number;
        link: number;
        size: number;
    }
    interface copyParams {
        callback: (output:[number, number, number]) => void;
        destination: string;
        exclusions: string[];
        replace: boolean;
        target: string;
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