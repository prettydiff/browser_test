/* lib/typescript/global.d - TypeScript interfaces used in many unrelated areas of the application. */

// an error reporting model that stores a stack trace and error text
interface error {
    error: string;
    stack: string[];
}

// a generic type to store programmatic flag data typically used with various simultaneous asynchronous tasks
interface flagList {
    [key:string]: boolean;
}

// defines the common library
interface module_common {
    capitalize: (input:string) => string;
    commas: (number:number) => string;
    prettyBytes: (an_integer:number) => string;
}

// describes file contents interpreted as a string literal
interface stringData {
    content: string;
    id: string;
    path: string;
}