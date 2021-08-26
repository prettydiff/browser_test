
// expedia demo test campaign

const expedia:campaign = {
    // the initial page to load into the browser
    startPage: "https://expedia.com",
    options: {
        browser: "chrome",
        delay: 0,
        devtools: false,
        noClose: false,
        port: 0
    },
    tests: [
        {
            delay: {
                node: [
                    ["getElementById", "location-field-destination", null]
                ],
                qualifier: "greater",
                target: ["clientHeight"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "wait",
                    node: [],
                    value: "5000"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "location-field-destination-menu", null],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Activate search bar",
            page: 0,
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "location-field-destination-menu", null],
                    ["getElementsByTagName", "ul", 0],
                    ["getElementsByTagName", "li", 0]
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
                        ["getElementById", "location-field-destination", null]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "location-field-destination", null]
                    ],
                    value: "dalla"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "location-field-destination", null]
                    ],
                    value: "s"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "location-field-destination", null]
                    ],
                    value: "s"
                }
            ],
            name: "Populate search list",
            page: 0,
            unit: []
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "location-field-destination-menu", null],
                        ["getElementsByTagName", "ul", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Select search destination",
            page: 0,
            unit: [
                {
                    node: [
                        ["getElementById", "location-field-destination-menu", null],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["innerHTML"],
                    type: "property",
                    value: "Dallas"
                }
            ]
        }
    ]
};

export default expedia;