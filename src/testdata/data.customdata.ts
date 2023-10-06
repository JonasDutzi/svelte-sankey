import type { SankeyData } from "../lib";

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
                                    value: 5,
                                    strokeColor: "var(--stroke-color-1)",
                                    strokeColorHover: "var(--stroke-color-1-hover)"
                                }
                            ],
                            data: {
                                totalValue: 5
                            },
                            anchorColor: "var(--stroke-color-1-hover)"
                        },
                        {
                            id: "biscuit",
                            label: "Biscuit",
                            links: [
                                {
                                    target: "semi_finished_good",
                                    value: 3,
                                    strokeColor: "var(--stroke-color-2)",
                                    strokeColorHover: "var(--stroke-color-2-hover)"
                                }
                            ],
                            data: {
                                totalValue: 3
                            },
                            anchorColor: "var(--stroke-color-2-hover)"
                        }
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
                                    value: 8,
                                    strokeColor: "var(--stroke-color-3)",
                                    strokeColorHover: "var(--stroke-color-3-hover)"
                                }
                            ],
                            data: {
                                totalValue: 8
                            },
                            anchorColor: "var(--stroke-color-3-hover)"
                        }
                    ]
                }
            ]
        },
        {
            id: "root",
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
                                    value: 8,
                                    strokeColor: "var(--stroke-color-4)",
                                    strokeColorHover: "var(--stroke-color-4-hover)"
                                },
                                {
                                    target: "chococake",
                                    value: 8,
                                    strokeColor: "var(--stroke-color-1)",
                                    strokeColorHover: "var(--stroke-color-1-hover)"
                                }
                            ],
                            data: {
                                totalValue: 16
                            },
                            anchorColor: "var(--stroke-color-4-hover)"
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
                        {
                            id: "strawberrycake",
                            label: "Strawberry Cake",
                            data: {
                                totalValue: 8
                            },
                            anchorColor: "var(--stroke-color-4-hover)"
                        },
                        {
                            id: "chococake",
                            label: "Chocolate Cake",
                            data: {
                                totalValue: 8
                            },
                            anchorColor: "var(--stroke-color-1-hover)"
                        }
                    ]
                }
            ]
        }
    ]
};
