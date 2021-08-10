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