
/* lib/browser/remote - A collection of instructions to allow event execution from outside the browser, like a remote control. */

declare global {
    interface Window {
        drialRemote: module_remote;
    }
}

// start chrome --remote-debugging-port=9000 --no-first-run --no-default-browser-check
// * --disable-web-security
// start firefox -start-debugger-server 9000

// chrome - https://chromedevtools.github.io/devtools-protocol/
// firefox - https://embracethered.com/blog/posts/2020/cookies-on-firefox/
// firefox - https://admx.help/?Category=FrontMotion&Policy=FrontMotion.Policies.Firefox::DEVTOOLS_DEBUGGER_PROMPT_CONNECTION

window.drialRemote = {

    /* The action this module should take in response to test instructions from the terminal */
    action: (function browser_remote_action():testBrowserAction {
        // adds custom extensions to the DOM
        {
            // getAncestor - A method to walk up the DOM towards the documentElement.
            // * identifier: string - The string value to search for.
            // * selector: "class", "id", "name" - The part of the element to compare the identifier against.
            const name = function browser_dom_name(item:Element):string {
                    return item.nodeName.toLowerCase();
                },
                getAncestor = function browser_dom_getAncestor(identifier:string, selector:selector):Element {
                    // eslint-disable-next-line
                    let start:Element = (this === document) ? document.documentElement : this;
                    const test = function browser_dom_getAncestor_test():boolean {
                            if (selector === "class") {
                                if (start.getAttribute("class") === identifier) {
                                    return true;
                                }
                                return false;
                            }
                            if (selector === "id") {
                                if (start.getAttribute("id") === identifier) {
                                    return true;
                                }
                                return false;
                            }
                            if (name(start) === identifier) {
                                return true;
                            }
                            return false;
                        };
                    if (start === null || start === undefined) {
                        return null;
                    }
                    if (start === document.documentElement || test() === true) {
                        return start;
                    }
                    do {
                        start = start.parentNode as Element;
                        if (start === null) {
                            return null;
                        }
                    } while (start !== document.documentElement && test() === false);
                    return start;
                },
                // getElementByAttribute - Search all descendant elements containing a matching attribute with matching value and returns an array of corresponding elements.
                // * name: string - The name of the attribute to search for.  An empty string means accept every attribute name.
                // * value: string - The attribute value to search for.  An empty string means accept any attribute value.  
                getElementsByAttribute = function browser_dom_getElementsByAttribute(name:string, value:string):Element[] {
                    // eslint-disable-next-line
                    const start:Element = (this === document) ? document.documentElement : this,
                        attrs:Attr[]    = start.getNodesByType(2) as Attr[],
                        out:Element[]   = [];
                    if (typeof name !== "string") {
                        name = "";
                    }
                    if (typeof value !== "string") {
                        value = "";
                    }
                    attrs.forEach(function browser_dom_getElementsByAttribute_each(item:Attr):void {
                        if (item.name === name || name === "") {
                            if (item.value === value || value === "") {
                                out.push(item.ownerElement);
                            }
                        }
                    });
                    return out;
                },
                // getElementsByText - Returns an array of descendant elements containing the white space trimmed text.
                // * textValue: string - The text to match.  The value must exactly match the complete text node value after trimming white space.
                // * castSensitive: boolean - Whether case sensitivity should apply.
                getElementsByText = function browser_dom_getElementsByText(textValue:string, caseSensitive?:boolean):Element[] {
                    // eslint-disable-next-line
                    const start:Element = (this === document) ? document.documentElement : this,
                        texts:Text[]    = start.getNodesByType(3) as Text[],
                        out:Element[]   = [];
                    if (typeof textValue !== "string") {
                        textValue = "";
                    } else {
                        textValue = textValue.replace(/^\s+/, "").replace(/\s+$/, "");
                    }
                    if (typeof caseSensitive !== "boolean") {
                        caseSensitive = false;
                    }
                    texts.forEach(function browser_dom_getElementsByText_each(item:Text):void {
                        const text:string = (caseSensitive === true)
                            ? item.textContent.toLowerCase()
                            : item.textContent;
                        if (textValue === "" && text.replace(/\s+/, "") !== "") {
                            out.push(item.parentElement);
                        } else if (textValue !== "" && text.replace(/^\s+/, "").replace(/\s+$/, "") === textValue) {
                            out.push(item.parentElement);
                        }
                    });
                    return out;
                },
                // getNodesByType - Returns an array of DOM nodes matching the provided node type.
                // * typeValue: string|number = The value must be a node type name or a node type number (0-12)
                // - An empty string, "all", or 0 means gather all descendant nodes regardless of type.
                // - For standard values see: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                getNodesByType = function browser_dom_getNodesByType(typeValue:number|string):Node[] {
                    const valueString:string = (typeof typeValue === "string") ? typeValue.toLowerCase() : "",
                        // eslint-disable-next-line
                        root:Element = (this === document) ? document.documentElement : this,
                        numb:number = (isNaN(Number(typeValue)) === false)
                            ? Number(typeValue)
                            : 0;
                    let types:number = (numb > 12 || numb < 0)
                        ? 0
                        : Math.round(numb);

                    // If input is a string and supported standard value
                    // associate to the standard numeric type
                    if (valueString === "all" || typeValue === "") {
                        types = 0;
                    } else if (valueString === "element_node") {
                        types = 1;
                    } else if (valueString === "attribute_node") {
                        types = 2;
                    } else if (valueString === "text_node") {
                        types = 3;
                    } else if (valueString === "cdata_section_node") {
                        types = 4;
                    } else if (valueString === "entity_reference_node") {
                        types = 5;
                    } else if (valueString === "entity_node") {
                        types = 6;
                    } else if (valueString === "processing_instruction_node") {
                        types = 7;
                    } else if (valueString === "comment_node") {
                        types = 8;
                    } else if (valueString === "document_node") {
                        types = 9;
                    } else if (valueString === "document_type_node") {
                        types = 10;
                    } else if (valueString === "document_fragment_node") {
                        types = 11;
                    } else if (valueString === "notation_node") {
                        types = 12;
                    }

                    // A handy dandy function to trap all the DOM walking
                    return (function browser_dom_getNodesByType_walking():Node[] {
                        const output:Node[] = [],
                            child  = function browser_dom_getNodesByType_walking_child(x:Element):void {
                                const children:NodeListOf<ChildNode> = x.childNodes;
                                let a:NamedNodeMap    = x.attributes,
                                    b:number    = a.length,
                                    c:number    = 0;
                                // Special functionality for attribute types.
                                if (b > 0 && (types === 2 || types === 0)) {
                                    do {
                                        output.push(a[c]);
                                        c = c + 1;
                                    } while (c < b);
                                }
                                b = children.length;
                                c = 0;
                                if (b > 0) {
                                    do {
                                        if (children[c].nodeType === types || types === 0) {
                                            output.push(children[c] as Element);
                                        }
                                        if (children[c].nodeType === 1) {
                                            //recursion magic
                                            browser_dom_getNodesByType_walking_child(children[c] as Element);
                                        }
                                        c = c + 1;
                                    } while (c < b);
                                }
                            };
                        child(root);
                        return output;
                    }());
                };

            // Create a document method
            if (document.getElementsByAttribute === undefined) {
                document.getElementsByAttribute = getElementsByAttribute;
            }
            if (document.getNodesByType === undefined) {
                document.getNodesByType         = getNodesByType;
            }
            if (document.getElementsByText === undefined) {
                document.getElementsByText      = getElementsByText;
            }

            // Ensure dynamically created elements get these methods too
            if (Element.prototype.getAncestor === undefined) {
                Element.prototype.getAncestor            = getAncestor;
            }
            if (Element.prototype.getElementsByAttribute === undefined) {
                Element.prototype.getElementsByAttribute = getElementsByAttribute;
            }
            if (Element.prototype.getNodesByType === undefined) {
                Element.prototype.getNodesByType         = getNodesByType;
            }
            if (Element.prototype.getElementsByText === undefined) {
                Element.prototype.getElementsByText      = getElementsByText;
            }
        }
        return "result";
    }()),

    /* Executes the delay test unit if a given test has a delay property */
    delay: function browser_remote_delay(config:testBrowserItem):void {
        let a:number = 0;
        const delay:number = 50,
            maxTries:number = 200,
            delayFunction = function browser_remote_delay_timeout():void {
                const testResult:[boolean, string, string] = window.drialRemote.evaluate(config.delay);
                if (testResult[0] === true) {
                    if (config.unit.length > 0) {
                        window.drialRemote.report(config.unit, window.drialRemote.index);
                    } else {
                        window.drialRemote.send([testResult], window.drialRemote.index, window.drialRemote.action);
                    }
                    return;
                }
                a = a + 1;
                if (a === maxTries) {
                    window.drialRemote.send([
                        [false, "delay timeout", config.delay.node.nodeString],
                        window.drialRemote.evaluate(config.delay)
                    ], window.drialRemote.index, window.drialRemote.action);
                    return;
                }
                setTimeout(browser_remote_delay_timeout, delay);
            };
        // eslint-disable-next-line
        console.log(`Drial - Executing delay on test number ${window.drialRemote.index + 1}: ${config.name}`);
        if (config.delay === undefined) {
            window.drialRemote.report(config.unit, window.drialRemote.index);
        } else {
            setTimeout(delayFunction, delay);
        }
    },

    /* Indicates a well formed test that is logically invalid against the DOM */
    domFailure: false,

    /* Report javascript errors as test failures */
    // eslint-disable-next-line
    error: function browser_remote_error(message:string, source:string, line:number, col:number, error:Error):void {
        window.drialRemote.send([[false, JSON.stringify({
            file: source,
            column: col,
            line: line,
            message: message,
            stack: (error === null)
                ? null
                : error.stack
        }), "error"]], window.drialRemote.index, window.drialRemote.action);
    },

    /* Determine whether a given test item is pass or fail */
    evaluate: function browser_remote_evaluate(test:testBrowserTest):[boolean, string, string] {
        const rawValue:Element|primitive = (test.type === "element")
                ? window.drialRemote.node(test.node, test.target[0])
                : window.drialRemote.getProperty(test),
            qualifier:qualifier = test.qualifier,
            configString:string = test.value as string;
        if (qualifier === "is" && rawValue === configString) {
            return [true, "", test.node.nodeString];
        }
        if (qualifier === "not" && rawValue !== configString) {
            return [true, "", test.node.nodeString];
        }
        if (typeof rawValue !== typeof configString) {
            return [false, window.drialRemote.stringify(rawValue as primitive), test.node.nodeString];
        }
        if (typeof rawValue === "string") {
            const index:number = rawValue.indexOf(configString);
            if (qualifier === "begins" && index === 0) {
                return [true, "", test.node.nodeString];
            }
            if (qualifier === "contains" && index > -1) {
                return [true, "", test.node.nodeString];
            }
            if (qualifier === "ends" && rawValue.slice(rawValue.length - configString.length) === configString) {
                return [true, "", test.node.nodeString];
            }
            if (qualifier === "not contains" && index < 0) {
                return [true, "", test.node.nodeString];
            }
        }
        if (typeof rawValue === "number") {
            if (qualifier === "greater" && rawValue > test.value) {
                return [true, "", test.node.nodeString];
            }
            if (qualifier === "lesser" && rawValue < test.value) {
                return [true, "", test.node.nodeString];
            }
        }
        if (test.type === "element") {
            return [false, "element", test.node.nodeString];
        }
        return [false, window.drialRemote.stringify(rawValue as primitive), test.node.nodeString];
    },

    /* Process a single event instance */
    event: function browser_remote_event(item:testBrowserRoute, pageLoad:boolean):void {
        let a:number = 0,
            refresh:boolean = false;
        const complete = function browser_remote_event_complete():void {
                if (refresh === false) {
                    window.drialRemote.delay(item.test);
                }
            },
            action = function browser_remote_event_action(index:number):void {
                let element:HTMLElement,
                    config:testBrowserEvent,
                    htmlElement:HTMLInputElement,
                    event:Event,
                    delay:number;
                do {
                    config = item.test.interaction[index];
                    if (config.event === "refresh") {
                        if (index === 0) {
                            location.reload();
                        } else {
                            window.drialRemote.error("The event 'refresh' was provided not as the first event of a test", "", 0, 0, null);
                            return;
                        }
                    } else if (config.event === "wait") {
                        delay = (isNaN(Number(config.value)) === true)
                            ? 0
                            : Number(config.value);
                        index = index + 1;
                        setTimeout(function browser_remote_event_action_delayNext():void {
                            if (index < eventLength) {
                                browser_remote_event_action(index);
                            } else {
                                complete();
                            }
                        }, delay);
                        return;
                    } else if (config.event === "resize" && config.node[0][0] === "window") {
                        if (config.coords === undefined || config.coords === null || config.coords.length !== 2 || isNaN(Number(config.coords[0])) === true || isNaN(Number(config.coords[0])) === true) {
                            window.drialRemote.send([
                                [false, `event error ${String(element)}`, config.node.nodeString]
                            ], item.index, item.action);
                            return;
                        }
                        window.resizeTo(Number(config.coords[0]), Number(config.coords[1]));
                    } else if (config.event !== "refresh-interaction") {
                        element = window.drialRemote.node(config.node, null) as HTMLElement;
                        if (window.drialRemote.domFailure === true) {
                            window.drialRemote.domFailure = false;
                            return;
                        }
                        if (element === null || element === undefined) {
                            window.drialRemote.send([
                                [false, `event error ${String(element)}`, config.node.nodeString]
                            ], item.index, item.action);
                            return;
                        }
                        if (config.event === "move") {
                            element.style.top = `${config.coords[0]}em`;
                            element.style.left = `${config.coords[1]}em`;
                        } else if (config.event === "resize") {
                            element.style.width = `${config.coords[0]}em`;
                            element.style.height = `${config.coords[1]}em`;
                        } else if (config.event === "setValue") {
                            htmlElement = element as HTMLInputElement;
                            if (config.value.indexOf("replace\u0000") === 0) {
                                const values:[string, string] = ["", ""],
                                    parent:Element = element.parentNode as Element,
                                    sep:string = (htmlElement.value.charAt(0) === "/")
                                        ? "/"
                                        : "\\";
                                config.value = config.value.replace("replace\u0000", "");
                                values[0] = config.value.slice(0, config.value.indexOf("\u0000"));
                                values[1] = config.value.slice(config.value.indexOf("\u0000") + 1).replace(/(\\|\/)/g, sep);
                                if (parent.getAttribute("class") === "fileAddress") {
                                    htmlElement.value = htmlElement.value.replace(values[0], values[1]);
                                } else {
                                    htmlElement.value = config.value;
                                }
                            } else {
                                htmlElement.value = config.value;
                            }
                        } else {
                            if (config.event === "keydown" || config.event === "keyup") {
                                if (config.value === "Alt") {
                                    if (config.event === "keydown") {
                                        window.drialRemote.keyAlt = true;
                                    } else {
                                        window.drialRemote.keyAlt = false;
                                    }
                                } else if (config.value === "Control") {
                                    if (config.event === "keydown") {
                                        window.drialRemote.keyControl = true;
                                    } else {
                                        window.drialRemote.keyControl = false;
                                    }
                                } else if (config.value === "Shift") {
                                    if (config.event === "keydown") {
                                        window.drialRemote.keyShift = true;
                                    } else {
                                        window.drialRemote.keyShift = false;
                                    }
                                } else {
                                    const tabIndex:number = element.tabIndex;
                                    event = new KeyboardEvent(config.event, {
                                        key: config.value,
                                        altKey: window.drialRemote.keyAlt,
                                        ctrlKey: window.drialRemote.keyControl,
                                        shiftKey: window.drialRemote.keyShift
                                    });
                                    element.tabIndex = 0;
                                    element.dispatchEvent(new Event("focus"));
                                    element.dispatchEvent(event);
                                    element.tabIndex = tabIndex;
                                }
                            } else if (config.event === "click" || config.event === "contextmenu" || config.event === "dblclick" || config.event === "mousedown" || config.event === "mouseenter" || config.event === "mouseleave" || config.event === "mousemove" || config.event === "mouseout" || config.event === "mouseover" || config.event === "mouseup" || config.event === "touchend" || config.event === "touchstart") {
                                event = new MouseEvent(config.event, {
                                    altKey: window.drialRemote.keyAlt,
                                    ctrlKey: window.drialRemote.keyControl,
                                    shiftKey: window.drialRemote.keyShift
                                });
                                element.dispatchEvent(event);
                            } else {
                                event = document.createEvent("Event");
                                event.initEvent(config.event, true, true);
                                element.dispatchEvent(event);
                            }
                        }
                    }
                    index = index + 1;
                } while (index < eventLength);
                complete();
            },
            eventLength:number = (item.test.interaction === null)
                ? 0
                : item.test.interaction.length;
        if (item.action === "nothing") {
            return;
        }
        window.drialRemote.action = item.action;
        window.drialRemote.index = item.index;
        if (eventLength < 1) {
            if (item.test.delay === undefined) {
                window.drialRemote.report(item.test.unit, 0);
            } else {
                window.drialRemote.delay(item.test);
            }
        } else {
            do {
                if (item.test.interaction[a].event === "refresh-interaction") {
                    if (pageLoad === true) {
                        window.drialRemote.delay(item.test);
                        return;
                    }
                    refresh = true;
                    break;
                }
                a = a + 1;
            } while (a < eventLength);
            action(0);
        }
    },

    /* Get the value of the specified property/attribute */
    getProperty: function browser_remote_getProperty(test:testBrowserTest):primitive {
        const element:Element = (test.node.length > 0)
                ? window.drialRemote.node(test.node, test.target[0])
                : null,
            pLength = test.target.length - 1,
            method = function browser_remote_getProperty_method(prop:Object, name:string):primitive {
                if (name.slice(name.length - 2) === "()") {
                    name = name.slice(0, name.length - 2);
                    // @ts-ignore - prop is some unknown DOM element or element property
                    return prop[name]();
                }
                // @ts-ignore - prop is some unknown DOM element or element property
                return prop[name];
            },
            property = function browser_remote_getProperty_property(origin:Element|Window):primitive {
                let b:number = 1,
                    item:Object = method(origin, test.target[0]);
                if (pLength > 1) {
                    do {
                        item = method(item, test.target[b]);
                        b = b + 1;
                    } while (b < pLength);
                }
                return method(item, test.target[b]);
            };
        if (test.type === "element") {
            return false;
        }
        if (test.target[0] === "window") {
            return property(window);
        }
        if (element === null) {
            return null;
        }
        if (element === undefined || pLength < 0) {
            return undefined;
        }
        return (test.type === "attribute")
            ? element.getAttribute(test.target[0])
            : (pLength === 0)
                ? method(element, test.target[0])
                : property(element);
    },

    /* The index of the current executing test */
    index: -1,

    /* Whether the Alt key is pressed, which can modify many various events */
    keyAlt: false,

    /* Whether the Control key is pressed, which can modify many various events */
    keyControl: false,

    /* Whether the Shift key is pressed, which can modify many various events */
    keyShift: false,

    /* Gather a DOM node using instructions from a data structure */
    node: function browser_remote_node(dom:testBrowserDOM, property:string):Element {
        let element:Document|Element = document,
            node:[domMethod, string, number],
            a:number = 0,
            fail:string = "";
        const nodeLength:number = dom.length,
            str:string[] = ["document"];
        if (dom === null || dom === undefined) {
            return null;
        }
        do {
            node = dom[a];
            if (node[0] === "getElementById" && a > 0) {
                fail = "Bad test. Method 'getElementById' must only occur as the first DOM method.";
            }
            if (node[2] === null && (node[0] === "childNodes" || node[0] === "getElementsByAttribute" || node[0] === "getElementsByClassName" || node[0] === "getElementsByName" || node[0] === "getElementsByTagName" || node[0] === "getElementsByText" || node[0] === "getModalsByModalType" || node[0] === "getNodesByType")) {
                if (property !== "length" && a !== nodeLength - 1) {
                    fail = `Bad test. Property '${node[0]}' requires an index value as the third data point of a DOM item: ["${node[0]}", "${node[1]}", ${node[2]}]`;
                }
            }
            if (node[1] === "" || node[1] === null || node[0] === "activeElement" || node[0] === "documentElement" || node[0] === "firstChild" || node[0] === "lastChild" || node[0] === "nextSibling" || node[0] === "parentNode" || node[0] === "previousSibling") {
                if (fail === "") {
                    // @ts-ignore - TypeScript's DOM types do not understand custom extensions to the Document object
                    element = element[node[0]];
                }
                str.push(".");
                str.push(node[0]);
            } else if (node[0] === "childNodes" && node[2] !== null) {
                if (fail === "") {
                    element = element.childNodes[node[2]] as Element;
                }
                str.push(".childNodes[");
                str.push(String(node[2]));
                str.push("]");
            } else if (node[2] === null || node[0] === "getElementById") {
                if (fail === "") {
                    // @ts-ignore - TypeScript cannot implicitly walk the DOM by combining data structures and DOM methods
                    element = element[node[0]](node[1]);
                }
                str.push(".");
                str.push(node[0]);
                str.push("(\"");
                str.push(node[1]);
                str.push("\")");
            } else {
                // @ts-ignore - TypeScript cannot implicitly walk the DOM by combining data structures and DOM methods
                const el:Element[] = element[node[0]](node[1]),
                    len:number = (el === null || el.length < 1)
                        ? -1
                        : el.length;
                str.push(".");
                str.push(node[0]);
                str.push("(\"");
                str.push(node[1]);
                str.push("\")");
                str.push("[");
                if (node[2] < 0 && len > 0) {
                    if (fail === "") {
                        element = el[len - 1];
                    }
                    str.push(String(len - 1));
                } else {
                    if (fail === "") {
                        element = el[node[2]];
                    }
                    str.push(String(node[2]));
                }
                str.push("]");
            }
            if (element === null || element === undefined) {
                dom.nodeString = str.join("");
                if (element === undefined) {
                    return undefined;
                }
                return null;
            }
            a = a + 1;
        } while (a < nodeLength);
        dom.nodeString = str.join("");
        if (fail !== "") {
            window.drialRemote.send([
                [false, fail, dom.nodeString]
            ], window.drialRemote.index, window.drialRemote.action);
            window.drialRemote.domFailure = true;
            return null;
        }
        return element as Element;
    },

    parse: function browser_remote_parse(testString:string):void {
        if (typeof testString === "string" && (/^\s*\{\s*"(action)"\s*:/).test(testString) === true) {
            window.drialRemote.event(JSON.parse(testString), false);
        } else {
            // eslint-disable-next-line
            console.error(`Drial - Poorly formed testString\n${testString}. It does not appear to be a drial test.`);
        }
    },

    /* Process all cases of a test scenario for a given test item */
    report: function browser_remote_report(test:testBrowserTest[], index:number):void {
        let a:number = 0;
        const result:[boolean, string, string][] = [],
            length:number = test.length;
        if (length > 0) {
            do {
                result.push(window.drialRemote.evaluate(test[a]));
                if (window.drialRemote.domFailure === true) {
                    window.drialRemote.domFailure = false;
                    return;
                }
                a = a + 1;
            } while (a < length);
            window.drialRemote.send(result, index, window.drialRemote.action);
        }
    },

    send: function browser_remote_send(payload:[boolean, string, string][], index:number, task:testBrowserAction):void {
        const report:testBrowserRoute = {
            action: task,
            exit: null,
            index: index,
            result: payload,
            test: null
        };
        if (payload[payload.length - 1][0] === false) {
            // eslint-disable-next-line
            console.error(`Drial - Test number ${index + 1} failed.`);
        } else {
            // eslint-disable-next-line
            console.info(`Drial - Test number ${index + 1} passed.`);
        }
        // eslint-disable-next-line
        console.log(`Drial - report:${JSON.stringify(report)}`);
    },

    /* The random port of the locally running http service*/
    serverPort: 0,

    /* Converts a primitive of any type into a string for presentation */
    stringify: function browser_remote_raw(primitive:primitive):string {
        return (typeof primitive === "string")
            ? `"${primitive.replace(/"/g, "\\\"")}"`
            : String(primitive);
    }
};

export {};