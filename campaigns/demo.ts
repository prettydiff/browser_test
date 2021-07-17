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
                },
                {
                    node: [
                        ["getElementById", "investYourWayHlCta", null],
                        ["getElementsByClassName", "heading", 0]
                    ],
                    qualifier: "is",
                    target: ["innerHTML"],
                    type: "property",
                    value: "Invest your way"
                }
            ]
        },

        // the interaction specified here will change the page
        {
            delay: {
                node: [],
                qualifier: "contains",
                target: ["window", "location", "href"],
                type: "property",
                value: "advantage_banking/?"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "advaBankSHLCta", null]
                    ]
                }
            ],
            name: "Click into 'Open a checking account'",
            unit: [
                {
                    node: [
                        ["getElementsByClassName", "accounts__card__middle", 2],
                        ["getElementsByTagName", "p", 0]
                    ],
                    qualifier: "is",
                    target: ["innerHTML"],
                    type: "property",
                    value: "$25 opening deposit"
                }
            ]
        },

        // an interaction that launches a modal
        {
            delay: {
                node: [
                    ["getElementById", "modal", null],
                    ["getElementsByTagName", "strong", 0]
                ],
                qualifier: "is",
                target: ["innerHTML"],
                type: "property",
                value: "No monthly maintenance fee for:"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "ProductDetails_P3_Opt1_LearnMore", null]
                    ]
                },
            ],
            name: "Open the first 'Learn More' modal",
            unit: [
            ]
        }
    ]
};

export default demo;