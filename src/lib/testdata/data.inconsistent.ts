import type { SankeyData } from "$types";

export const sankeyData: SankeyData = {
	data: [
		{
			id: "input",
			columnLabel: "Input",
			rows: [
				{
					rowLabel: "Product",
					items: [
						{ id: "flour", label: "Flour" },
						{ id: "flour", label: "Biscuit" }
					]
				},
				{
					rowLabel: "Resource Usage",
					items: [{ id: "chocolate_production", label: "Chocolate Production" }]
				}
			]
		},
		{
			id: "input",
			columnLabel: "root",
			rows: [
				{
					rowLabel: "Product",
					items: [{ id: "semi_finished_good", label: "Semi-finished good" }]
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
	],
	links: [
		{
			source: "flour",
			target: "semi_finished_good",
			value: 180
		},
		{
			source: "biscuit",
			target: "semi_finished_good",
			value: 9
		},
		{
			source: "chocolate_production",
			target: "semi_finished_good",
			value: 4
		},
		{
			source: "semi_finished_good",
			target: "strawberrycake",
			value: 5
		},
		{
			source: "semi_finished_good",
			target: "",
			value: 8
		}
	]
};
