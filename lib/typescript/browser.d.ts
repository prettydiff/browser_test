/* lib/typescript/browser.d - TypeScript interfaces used by browser specific libraries. */

// dom
interface Document {
    getElementsByAttribute: (name:string, value:string) => Element[];
    getNodesByType: (typeValue:number | string) => Node[];
    getElementsByText: (textValue:string, caseSensitive?:boolean) => Element[];
}
interface Element {
    getAncestor: (identifier:string, selector:selector) => Element;
    getElementsByAttribute: (name:string, value:string) => Element[];
    getNodesByType: (typeValue:number | string) => Node[];
    getElementsByText: (textValue:string, caseSensitive?:boolean) => Element[];
}
// ------------------------------------

// remote
interface module_remote {
    delay: (config:testBrowserItem) => void;
    domFailure: boolean;
    error: (message:string, source:string, line:number, col:number, error:Error) => void;
    evaluate: (test:testBrowserTest) => [boolean, string, string];
    event: (item:testBrowserRoute, pageLoad:boolean) => void;
    getProperty: (test:testBrowserTest) => primitive;
    index: number;
    keyAlt: boolean;
    keyControl: boolean;
    keyShift: boolean;
    node: (dom:testBrowserDOM, property:string) => Document|Element|Window;
    parse: (testString:string) => void;
    report: (test:testBrowserTest[], index:number) => void;
    send: (payload:[boolean, string, string][], index:number) => void;
    stringify: (primitive:primitive) => string;
}
// ------------------------------------