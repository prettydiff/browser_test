// demo test campaign

const demo:campaign = {
    // the initial page to load into the browser
    startPage: "https://promo.bankofamerica.com/advantage_banking/?cm_sp=DEP-Checking-_-NotAssigned-",
    browser: "chrome",
    // an actual port value must be specified for Firefox type browsers as nobody knows how to find its dynamic port
    // chrome based browsers can accept a port of 0 which will select a random available TCP port
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
            unit: []
        },

        // click learn more Preferred Rewards to open a new tab
        {
            delay: {
                node: [
                    ["getElementsByTagName", "body", 0]
                ],
                qualifier: "is",
                target: ["offsetTop"],
                type: "property",
                value: 900
            },
            interaction: [
                {
                    event: "wait",
                    node: [],
                    value: "2000"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "SecondaryCTAs_S1_cta1_LearnMore", null]
                    ]
                }
            ],
            name: "Click learn more Preferred Rewards to open a new tab",
            unit: []
        }
    ]
};

export default demo;