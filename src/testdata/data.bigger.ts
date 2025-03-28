import type { SankeyData } from "../lib/index";

export const sankeyData: SankeyData = {
    data: [
        {
            id: "left",
            columnLabel: "Raw Materials",
            rows: [
                {
                    rowLabel: "Category 1",
                    items: [
                        {
                            id: "input1",
                            label: "Input 1",
                            links: [
                                {
                                    target: "semifinished1",
                                    value: 35
                                },
                                {
                                    target: "semifinished2",
                                    value: 16
                                }
                            ]
                        },
                        {
                            id: "input2",
                            label: "Input 2",
                            links: [{ target: "semifinished1", value: 16 }]
                        },
                        {
                            id: "input3",
                            label: "Input 3",
                            links: [
                                {
                                    target: "semifinished1",
                                    value: 10
                                }
                            ]
                        },
                        {
                            id: "input4",
                            label: "Input 4",
                            links: [
                                {
                                    target: "semifinished2",
                                    value: 6
                                },
                                {
                                    target: "semifinished1",
                                    value: 6
                                }
                            ]
                        }
                    ]
                },
                {
                    rowLabel: "Category 2",
                    items: [
                        {
                            id: "input5",
                            label: "Input 5",
                            links: [
                                {
                                    target: "semifinished1",
                                    value: 22
                                },
                                {
                                    target: "semifinished2",
                                    value: 22
                                }
                            ]
                        },
                        {
                            id: "input6",
                            label: "Input 6",
                            links: [
                                {
                                    target: "semifinished2",
                                    value: 44
                                }
                            ]
                        },
                        {
                            id: "input7",
                            label: "Input 7",
                            links: [
                                {
                                    target: "semifinished2",
                                    value: 60
                                },
                                {
                                    target: "semifinished2",
                                    value: 80
                                }
                            ]
                        },
                        {
                            id: "input8",
                            label: "Input 8",
                            links: [
                                {
                                    target: "semifinished2",
                                    value: 5
                                }
                            ]
                        }
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
                        {
                            id: "semifinished1",
                            label: "Semi-finished good 1",
                            links: [
                                {
                                    target: "finished1",
                                    value: 30
                                },
                                {
                                    target: "finished2",
                                    value: 59
                                }
                            ]
                        },
                        {
                            id: "semifinished2",
                            label: "Semi-finished good 2",
                            links: [
                                {
                                    target: "finished1",
                                    value: 100
                                },
                                {
                                    target: "finished2",
                                    value: 73
                                }
                            ]
                        }
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
    ]
};
