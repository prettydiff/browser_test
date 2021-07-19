/* lib/typescript/types.d - TypeScript static types. */

type browser = "brave" | "chrome" | "edge" | "firefox" | "msedge" | "opera" | "vivaldi";
type browserDOM = [domMethod, string, number];
type buildPhase = "commands" | "configurations" | "libReadme" | "lint" | "typescript" | "version";
type commands = "build" | "commands" | "directory" | "get" | "lint" | "mkdir" | "remove" | "update" | "version" | "websites";
type directoryItem = [string,"directory" |  "error" | "file" | "link", string, number, number, directoryData];
type directoryMode = "array" | "hash" | "list" | "read" | "search";
type directoryResponse = directoryList | "missing" | "noShare" | "readOnly";
type domMethod = "activeElement" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling" | "window";
type dragFlag = "" | "control" | "shift";
type eventCallback = (event:Event, callback:Function) => void;
type eventName = "blur" | "click" | "contextmenu" | "dblclick" | "focus" | "keydown" | "keyup" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "move" | "pageAddress" | "refresh-interaction" | "refresh" | "resize" | "select" | "setValue" | "touchend" | "touchstart" | "wait";
type fileAction = "fs-base64" | "fs-close" | "fs-destroy" | "fs-details" | "fs-directory" | "fs-execute" | "fs-hash" | "fs-new" | "fs-read" | "fs-rename" | "fs-search" | "fs-write";
type primitive = boolean | number | string | null | undefined;
type qualifier = "begins" | "contains" | "ends" | "greater" | "is" | "lesser" | "not contains" | "not";
type qualifierFile = "file begins" | "file contains" | "file ends" | "file is" | "file not contains" | "file not" | "filesystem contains" | "filesystem not contains";
type searchType = "fragment" | "negation" | "regex";
type selector = "class" | "id" | "tag";
type testBrowserAction = "close" | "nothing" | "request" | "reset-browser" | "reset-complete" | "reset-request" | "reset-response" | "respond" | "result";
type testBrowserMode = "device" | "remote" | "self" | "user";
type testListType = "" | "browser_device" | "browser_remote" | "browser_self" | "browser_user" | "service" | "simulation";
type testLogFlag = testListType | "";