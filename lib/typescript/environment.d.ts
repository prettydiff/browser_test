/* lib/typescript/environment.d - TypeScript interfaces that define environmental objects. */

// terminal, universal
interface terminalVariables {
    cli: string;
    command: commands;
    command_instruction: string;
    commands: commandDocumentation;
    cwd: string;
    date: string;
    exclusions: string[];
    flags: {
        error: boolean;
        write: string;
    };
    git_hash: string;
    js: string;
    name: string;
    node: {
        // eslint-disable-next-line
        child : any;
        // eslint-disable-next-line
        crypto: any;
        // eslint-disable-next-line
        fs    : any;
        // eslint-disable-next-line
        http  : any;
        // eslint-disable-next-line
        https : any;
        // eslint-disable-next-line
        http2 : any;
        // eslint-disable-next-line
        net   : any;
        // eslint-disable-next-line
        os    : any;
        // eslint-disable-next-line
        path  : any;
        // eslint-disable-next-line
        spawn : any;
        // eslint-disable-next-line
        stream: any;
        // eslint-disable-next-line
        zlib  : any;
    };
    port_default: {
        insecure: number;
        secure: number;
    };
    projectPath: string;
    sep: string;
    startTime: bigint;
    text: {
        [key:string]: string;
    };
    verbose: boolean;
    version: string;
}
interface version {
    date: string;
    git_hash: string;
    version: string;
}
// ------------------------------------