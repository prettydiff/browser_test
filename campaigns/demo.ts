// demo test campaign

const demo:campaign = {
    // the initial page to load into the browser
    startPage: "https://www.bankofamerica.com",
    browser: "chrome",
    // an actual port value must be specified for Firefox type browsers as nobody knows how to find its dynamic port
    // chrome based browsers can accept a port of 0 which will select a random available TCP port
    port: 0,
    tests: [

        // a test with no interactions
        // this test just verifies artifacts on the start page
        {
            delay: {
                node: [
                    ["getElementById", "investYourWayHlCta", null],
                    ["getElementsByClassName", "heading", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "Invest your way"
            },
            interaction: null,
            name: "Verify artifacts on Bank of America home page",
            unit: [
                {
                    node: [
                        ["getElementById", "globalInputsValidationForm", null],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["id"],
                    type: "attribute",
                    value: "signIn"
                }
            ]
        },

        // the interaction specified here will change the page
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
                    event: "click",
                    node: [
                        ["getElementById", "mastheadPartialContent", null],
                        ["getElementsByClassName", "masthead-content", 0]
                    ]
                }
            ],
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
        }
    ]
};

export default demo;