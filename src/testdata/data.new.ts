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
									value: 5
								}
							]
						},
						{
							id: "biscuit",
							label: "Biscuit",
							links: [
								{
									target: "semi_finished_good",
									value: 3
								}
							]
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
									value: 8
								}
							]
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
									value: 8
								},
								{
									target: "chococake",
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
