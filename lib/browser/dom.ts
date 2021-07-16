
/* lib/browser/dom - Extensions to the DOM to provide navigational functionality not present from the standard methods */

const dom = function browser_dom():void {
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
};

export default dom;