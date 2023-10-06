import type { SankeyData } from "../lib/types";

export const sankeyData: SankeyData = {
    data: [
        {
            id: "input",
            columnLabel: "Input",
            rows: [
                {
                    rowLabel: "Product",
                    items: [
                        {
                            id: "flour",
                            label: "Flour",
                            links: [
                                {
                                    target: "semi_finished_good",
                                    value: 180
                                }
                            ]
                        },
                        { id: "flour", label: "Biscuit" }
                    ]
                },
                {
                    rowLabel: "Resource Usage",
                    items: [
                        {
                            id: "chocolate_production",
                            label: "Chocolate Production",
                            links: [
                                {
                                    target: "semi_finished_good",
                                    value: 4
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "input",
            columnLabel: "root",
            rows: [
                {
                    rowLabel: "Product",
                    items: [
                        {
                            id: "semi_finished_good",
                            label: "Semi-finished good",
                            links: [
                                {
                                    target: "strawberrycake",
                                    value: 5
                                },
                                {
                                    target: "",
                                    value: 8
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "output",
            columnLabel: "Output",
            rows: [
                {
                    rowLabel: "Product",
                    items: [
                        { id: "strawberrycake", label: "Strawberry Cake" },
                        { id: "chococake", label: "Chocolate Cake" }
                    ]
                }
            ]
        }
    ]
};
