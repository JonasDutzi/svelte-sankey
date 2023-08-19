export const sankeyData = {
    data: [
        {
            id: "left",
            columnLabel: "Raw Materials",
            rows: [
                {
                    rowLabel: "Category 1",
                    items: [
                        { id: "input1", label: "Input 1" },
                        { id: "input2", label: "Input 2" },
                        { id: "input3", label: "Input 3" },
                        { id: "input4", label: "Input 4" }
                    ]
                },
                {
                    rowLabel: "Category 2",
                    items: [
                        { id: "input5", label: "Input 5" },
                        { id: "input6", label: "Input 6" },
                        { id: "input7", label: "Input 7" },
                        { id: "input8", label: "Input 8" }
                    ]
                }
            ]
        },
        {
            id: "middle",
            columnLabel: "Semi-finished Goods",
            rows: [
                {
                    rowLabel: "Category 1",
                    items: [
                        { id: "semifinished1", label: "Semi-finished good 1" },
                        { id: "semifinished2", label: "Semi-finished good 2" }
                    ]
                }
            ]
        },
        {
            id: "right",
            columnLabel: "Products",
            rows: [
                {
                    rowLabel: "Product",
                    items: [
                        { id: "finished1", label: "Finished good 1" },
                        { id: "finished2", label: "Finished good 2" }
                    ]
                }
            ]
        }
    ],
    links: [
        {
            source: "input1",
            target: "semifinished1",
            value: 35
        },
        {
            source: "input1",
            target: "semifinished2",
            value: 16
        },
        {
            source: "input2",
            target: "semifinished1",
            value: 16
        },
        {
            source: "input3",
            target: "semifinished1",
            value: 10
        },
        {
            source: "input4",
            target: "semifinished2",
            value: 6
        },
        {
            source: "input4",
            target: "semifinished1",
            value: 6
        },
        {
            source: "input5",
            target: "semifinished1",
            value: 22
        },
        {
            source: "input5",
            target: "semifinished2",
            value: 22
        },
        {
            source: "input6",
            target: "semifinished2",
            value: 44
        },
        {
            source: "input7",
            target: "semifinished2",
            value: 60
        },
        {
            source: "input7",
            target: "semifinished2",
            value: 80
        },
        {
            source: "input8",
            target: "semifinished2",
            value: 5
        },
        {
            source: "semifinished1",
            target: "finished1",
            value: 30
        },
        {
            source: "semifinished1",
            target: "finished2",
            value: 59
        },
        {
            source: "semifinished2",
            target: "finished1",
            value: 100
        },
        {
            source: "semifinished2",
            target: "finished2",
            value: 73
        }
    ]
};
