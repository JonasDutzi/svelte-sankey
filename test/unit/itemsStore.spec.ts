import { describe, it, expect, beforeEach, vi } from "vitest";
import { itemsStore } from "../../src/lib/stores/items.svelte";
import { dataStore } from "../../src/lib/stores/data.svelte";
import { linksStore } from "../../src/lib/stores/links.svelte";
import { logError } from "../../src/lib/helper";
import type { SankeyColumn } from "../../src/lib/types";
import type { Link } from "../../src/lib/stores/links.svelte";

// Mock the logError function
vi.mock("../../src/lib/helper", () => ({
	logError: vi.fn()
}));

describe("ItemsStore", () => {
	beforeEach(() => {
		// Clear all related stores before each test
		dataStore.data = {};
		linksStore.data = {};
		// Clear mock calls
		vi.clearAllMocks();
	});

	describe("initial state", () => {
		it("should start with empty items when no data is available", () => {
			expect(itemsStore.data).toEqual({});
		});
	});

	describe("getItems method", () => {
		it("should return empty items when dataStore is empty", () => {
			const links: Link[] = [
				{
					source: "item1",
					target: "item2",
					value: 100
				}
			];

			links.forEach((link) => linksStore.add(link));

			expect(itemsStore.data).toEqual({});
		});

		it("should return empty items when linksStore is empty", () => {
			const columns: SankeyColumn[] = [
				{
					id: "column1",
					columnLabel: "Column 1",
					rows: [
						{
							rowLabel: "Row 1",
							items: [
								{ id: "item1", label: "Item 1" },
								{ id: "item2", label: "Item 2" }
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			expect(itemsStore.data).toEqual({});
		});

		it("should create items with sources and targets when both stores have data", () => {
			// Setup data store
			const columns: SankeyColumn[] = [
				{
					id: "input",
					columnLabel: "Input",
					rows: [
						{
							rowLabel: "Products",
							items: [
								{ id: "flour", label: "Flour" },
								{ id: "sugar", label: "Sugar" }
							]
						}
					]
				},
				{
					id: "output",
					columnLabel: "Output",
					rows: [
						{
							rowLabel: "Products",
							items: [{ id: "cake", label: "Cake" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			// Setup links store
			const links: Link[] = [
				{
					source: "flour",
					target: "cake",
					value: 50
				},
				{
					source: "sugar",
					target: "cake",
					value: 30
				}
			];

			links.forEach((link) => linksStore.add(link));

			const items = itemsStore.data;

			// Check flour item
			expect(items["flour"]).toEqual({
				id: "flour",
				label: "Flour",
				columnKey: "input",
				sources: [],
				targets: [{ id: "cake", value: 50 }],
				totalValues: {
					sources: 0,
					targets: 50
				}
			});

			// Check sugar item
			expect(items["sugar"]).toEqual({
				id: "sugar",
				label: "Sugar",
				columnKey: "input",
				sources: [],
				targets: [{ id: "cake", value: 30 }],
				totalValues: {
					sources: 0,
					targets: 30
				}
			});

			// Check cake item
			expect(items["cake"]).toEqual({
				id: "cake",
				label: "Cake",
				columnKey: "output",
				sources: [
					{ id: "flour", value: 50 },
					{ id: "sugar", value: 30 }
				],
				targets: [],
				totalValues: {
					sources: 80,
					targets: 0
				}
			});
		});

		it("should handle items with multiple sources and targets", () => {
			// Setup a more complex scenario
			const columns: SankeyColumn[] = [
				{
					id: "input",
					columnLabel: "Input",
					rows: [
						{
							rowLabel: "Raw Materials",
							items: [
								{ id: "material1", label: "Material 1" },
								{ id: "material2", label: "Material 2" }
							]
						}
					]
				},
				{
					id: "processing",
					columnLabel: "Processing",
					rows: [
						{
							rowLabel: "Semi-finished",
							items: [{ id: "intermediate", label: "Intermediate Product" }]
						}
					]
				},
				{
					id: "output",
					columnLabel: "Output",
					rows: [
						{
							rowLabel: "Final Products",
							items: [
								{ id: "product1", label: "Product 1" },
								{ id: "product2", label: "Product 2" }
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const links: Link[] = [
				{ source: "material1", target: "intermediate", value: 40 },
				{ source: "material2", target: "intermediate", value: 60 },
				{ source: "intermediate", target: "product1", value: 70 },
				{ source: "intermediate", target: "product2", value: 30 }
			];

			links.forEach((link) => linksStore.add(link));

			const items = itemsStore.data;

			// Check intermediate item (has both sources and targets)
			expect(items["intermediate"]).toEqual({
				id: "intermediate",
				label: "Intermediate Product",
				columnKey: "processing",
				sources: [
					{ id: "material1", value: 40 },
					{ id: "material2", value: 60 }
				],
				targets: [
					{ id: "product1", value: 70 },
					{ id: "product2", value: 30 }
				],
				totalValues: {
					sources: 100,
					targets: 100
				}
			});
		});

		it("should handle items with custom data properties", () => {
			const columns: SankeyColumn[] = [
				{
					id: "column1",
					columnLabel: "Column 1",
					rows: [
						{
							rowLabel: "Row 1",
							items: [
								{
									id: "item1",
									label: "Item 1",
									data: {
										customProp: "custom value",
										numericProp: 42
									}
								}
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const links: Link[] = [
				{
					source: "item1",
					target: "item2", // This target doesn't exist in data, but that's ok for this test
					value: 10
				}
			];

			links.forEach((link) => linksStore.add(link));

			const items = itemsStore.data;

			expect(items["item1"]).toEqual({
				id: "item1",
				label: "Item 1",
				data: {
					customProp: "custom value",
					numericProp: 42
				},
				columnKey: "column1",
				sources: [],
				targets: [{ id: "item2", value: 10 }],
				totalValues: {
					sources: 0,
					targets: 10
				}
			});
		});

		it("should calculate correct total values for multiple edges", () => {
			const columns: SankeyColumn[] = [
				{
					id: "center",
					columnLabel: "Center",
					rows: [
						{
							rowLabel: "Hub",
							items: [{ id: "hub", label: "Hub Item" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			// Add multiple sources and targets for the hub item
			const links: Link[] = [
				{ source: "source1", target: "hub", value: 25 },
				{ source: "source2", target: "hub", value: 35 },
				{ source: "source3", target: "hub", value: 40 },
				{ source: "hub", target: "target1", value: 30 },
				{ source: "hub", target: "target2", value: 70 }
			];

			links.forEach((link) => linksStore.add(link));

			const items = itemsStore.data;

			expect(items["hub"].totalValues).toEqual({
				sources: 100, // 25 + 35 + 40
				targets: 100 // 30 + 70
			});

			expect(items["hub"].sources).toHaveLength(3);
			expect(items["hub"].targets).toHaveLength(2);
		});

		it("should handle items with zero values", () => {
			const columns: SankeyColumn[] = [
				{
					id: "column1",
					columnLabel: "Column 1",
					rows: [
						{
							rowLabel: "Row 1",
							items: [{ id: "item1", label: "Item 1" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const links: Link[] = [
				{
					source: "item1",
					target: "item2",
					value: 0
				}
			];

			links.forEach((link) => linksStore.add(link));

			const items = itemsStore.data;

			expect(items["item1"].totalValues).toEqual({
				sources: 0,
				targets: 0
			});
		});

		it("should handle items with no connections", () => {
			const columns: SankeyColumn[] = [
				{
					id: "isolated",
					columnLabel: "Isolated",
					rows: [
						{
							rowLabel: "Standalone",
							items: [{ id: "isolated_item", label: "Isolated Item" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			// Add some links that don't involve our isolated item
			const links: Link[] = [
				{
					source: "other_item1",
					target: "other_item2",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			const items = itemsStore.data;

			expect(items["isolated_item"]).toEqual({
				id: "isolated_item",
				label: "Isolated Item",
				columnKey: "isolated",
				sources: [],
				targets: [],
				totalValues: {
					sources: 0,
					targets: 0
				}
			});
		});

		it("should log error when duplicate item IDs are found", () => {
			const columns: SankeyColumn[] = [
				{
					id: "column1",
					columnLabel: "Column 1",
					rows: [
						{
							rowLabel: "Row 1",
							items: [{ id: "duplicate_id", label: "First Item" }]
						}
					]
				},
				{
					id: "column2",
					columnLabel: "Column 2",
					rows: [
						{
							rowLabel: "Row 2",
							items: [{ id: "duplicate_id", label: "Second Item" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const links: Link[] = [
				{
					source: "duplicate_id",
					target: "other_item",
					value: 10
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Trigger the getItems calculation
			const items = itemsStore.data;

			// Should log an error for the duplicate ID
			expect(logError).toHaveBeenCalledWith('Sankey Item id must be unique. Item with id "duplicate_id" already exists.');

			// Should only have one item (the first one processed)
			expect(Object.keys(items).filter((key) => key === "duplicate_id")).toHaveLength(1);
		});
	});

	describe("reactive updates", () => {
		it("should update items when dataStore changes", () => {
			// Initially empty
			expect(itemsStore.data).toEqual({});

			// Add some data
			const column: SankeyColumn = {
				id: "test",
				columnLabel: "Test",
				rows: [
					{
						rowLabel: "Test Row",
						items: [{ id: "test_item", label: "Test Item" }]
					}
				]
			};

			dataStore.addColumn(column);

			const link: Link = {
				source: "test_item",
				target: "other_item",
				value: 25
			};

			linksStore.add(link);

			// Should now have the item
			expect(itemsStore.data["test_item"]).toBeDefined();
			expect(itemsStore.data["test_item"].id).toBe("test_item");
		});

		it("should update items when linksStore changes", () => {
			// Setup initial data
			const column: SankeyColumn = {
				id: "test",
				columnLabel: "Test",
				rows: [
					{
						rowLabel: "Test Row",
						items: [{ id: "test_item", label: "Test Item" }]
					}
				]
			};

			dataStore.addColumn(column);

			// Initially no links, so no items exist (because getItems requires both stores to have data)
			expect(itemsStore.data["test_item"]).toBeUndefined();

			// Add a link
			const link: Link = {
				source: "test_item",
				target: "other_item",
				value: 25
			};

			linksStore.add(link);

			// Should now have the item with the target
			expect(itemsStore.data["test_item"]).toBeDefined();
			expect(itemsStore.data["test_item"].sources).toEqual([]);
			expect(itemsStore.data["test_item"].targets).toEqual([{ id: "other_item", value: 25 }]);
		});
	});
});
