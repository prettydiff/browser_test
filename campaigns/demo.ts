// demo test campaign

const demo:campaign = {
    // the initial page to load into the browser
    startPage: "https://promo.bankofamerica.com/advantage_banking/?cm_sp=DEP-Checking-_-NotAssigned-",
    browser: "chrome",
    port: 0,
    tests: [

        // verify artifacts on the start page
        {
            delay: {
                node: [
                    ["getElementsByClassName", "accounts__card__middle", 2],
                    ["getElementsByTagName", "p", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "$100 opening deposit"
            },
            interaction: null,
            name: "Click into 'Open a checking account'",
            page: 0,
            unit: [
                {
                    node: [],
                    qualifier: "contains",
                    target: ["window", "location", "href"],
                    type: "property",
                    value: "advantage_banking/?"
                }
            ]
        },

        // evaluate a modal in the page
        {
            delay: {
                node: [
                    ["getElementById", "modal", null]
                ],
                qualifier: "is",
                target: ["style", "display"],
                type: "property",
                value: "flex"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "ProductDetails_P3_Opt3_LearnMore", null]
                    ]
                }
            ],
            name: "Evaluate a modal in the page",
            page: 0,
            unit: [
                {
                    node: [
                        ["getElementById", "modal", null],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["innerHTML"],
                    type: "property",
                    value: "No monthly maintenance fee for:"
                },
                {
                    node: [
                        ["getElementById", "modal", null],
                        ["getElementsByClassName", "text--regalRed", 1],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["innerHTML"],
                    type: "property",
                    value: "$4.95"
                }
            ]
        },

        // close the modal
        {
            delay: {
                node: [
                    ["getElementById", "modal", null]
                ],
                qualifier: "is",
                target: ["style", "display"],
                type: "property",
                value: "none"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "Modal_Close", null]
                    ]
                }
            ],
            name: "Close the modal",
            page: 0,
            unit: []
        },

        // manually change the page address
        {
            delay: {
                node: [
                    ["getElementsByTagName", "body", 0],
                    ["getElementsByTagName", "font", 0],
                    ["getElementsByTagName", "a", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "Privacy Policy"
            },
            interaction: [
                {
                    event: "pageAddress",
                    node: [],
                    value: "https://www.spacejam.com/1996/"
                }
            ],
            name: "Manually change the page address",
            page: 0,
            unit: []
        },

        // go back
        {
            delay: {
                node: [
                    ["getElementsByClassName", "accounts__card__middle", 2],
                    ["getElementsByTagName", "p", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "$100 opening deposit"
            },
            interaction: [
                {
                    event: "historyBack",
                    node: []
                }
            ],
            name: "Go back",
            page: 0,
            unit: []
        },

        // go forward
        {
            delay: {
                node: [
                    ["getElementsByTagName", "body", 0],
                    ["getElementsByTagName", "font", 0],
                    ["getElementsByTagName", "a", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "Privacy Policy"
            },
            interaction: [
                {
                    event: "historyForward",
                    node: []
                }
            ],
            name: "Go forward",
            page: 0,
            unit: []
        },

        // go back again
        {
            delay: {
                node: [
                    ["getElementsByClassName", "accounts__card__middle", 2],
                    ["getElementsByTagName", "p", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "$100 opening deposit"
            },
            interaction: [
                {
                    event: "historyBack",
                    node: []
                }
            ],
            name: "Go back again",
            page: 0,
            unit: []
        },

        // click learn more Preferred Rewards to open a new tab
        {
            delay: {
                node: [
                    ["getElementById", "Footer_Logo", null],
                    ["getNodesByType", "element", 0]
                ],
                qualifier: "is",
                target: ["nodeName", "toLowerCase()"],
                type: "property",
                value: "img"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "SecondaryCTAs_S1_cta1_LearnMore", null]
                    ]
                }
            ],
            name: "Click learn more Preferred Rewards to open a new tab",
            page: 0,
            unit: [
                {
                    node: [
                        ["getElementById", "Footer_Logo", null],
                        ["getNodesByType", "element", 0]
                    ],
                    qualifier: "is",
                    target: ["alt"],
                    type: "attribute",
                    value: "Bank of America"
                },
                {
                    node: [
                        ["getElementById", "Footer_Logo", null],
                        ["getNodesByType", "element", 0]
                    ],
                    qualifier: "is",
                    target: ["src"],
                    type: "attribute",
                    value: "/global/assets/images/logo-bac-horiz-1.0.0.svg"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "tier1-tileNumber-3", null],
                    ["nextSibling", null, null],
                    ["getElementsByTagName", "h2", 0]
                ],
                qualifier: "greater",
                target: ["clientHeight"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "tier1-tileNumber-1", null],
                        ["getElementsByTagName", "a", 0]
                    ]
                }
            ],
            name: "Evaluate content in new bank tab, Preferred Rewards",
            page: 1,
            unit: [
                {
                    node: [
                        ["getElementsByTagName", "h2", 3]
                    ],
                    qualifier: "is",
                    target: ["innerHTML"],
                    type: "property",
                    value: "The best relationships grow over time"
                },
                {
                    node: [
                        ["getElementById", "tier1-tileNumber-3", null],
                        ["nextSibling", null, null],
                        ["getElementsByTagName", "h2", 0]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "A rewards bonus on eligible Bank of America credit cards."
                }
            ]
        }
    ]
};

export default demo;