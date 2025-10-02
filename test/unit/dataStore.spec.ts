import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "../../src/lib/stores/data.svelte";
import type { SankeyColumn } from "../../src/lib/types";

describe("DataStore", () => {
	beforeEach(() => {
		// Clear the store before each test
		dataStore.data = {};
	});

	describe("initial state", () => {
		it("should start with empty data", () => {
			expect(dataStore.data).toEqual({});
		});
	});

	describe("addColumn method", () => {
		it("should add a column", () => {
			const column: SankeyColumn = {
				id: "column-1",
				columnLabel: "Test Column",
				rows: []
			};

			dataStore.addColumn(column);

			expect(dataStore.data["column-1"]).toEqual(column);
		});

		it("should add multiple columns", () => {
			const column1: SankeyColumn = {
				id: "column-1",
				columnLabel: "First Column",
				rows: []
			};

			const column2: SankeyColumn = {
				id: "column-2",
				columnLabel: "Second Column",
				rows: []
			};

			dataStore.addColumn(column1);
			dataStore.addColumn(column2);

			expect(Object.keys(dataStore.data)).toHaveLength(2);
			expect(dataStore.data["column-1"]).toEqual(column1);
			expect(dataStore.data["column-2"]).toEqual(column2);
		});

		it("should update an existing column", () => {
			const column1: SankeyColumn = {
				id: "column-1",
				columnLabel: "Original Label",
				rows: []
			};

			const column2: SankeyColumn = {
				id: "column-1",
				columnLabel: "Updated Label",
				rows: [{ items: [] }]
			};

			dataStore.addColumn(column1);
			dataStore.addColumn(column2);

			expect(dataStore.data["column-1"]).toEqual(column2);
			expect(dataStore.data["column-1"].columnLabel).toBe("Updated Label");
		});
	});

	describe("removeColumn method", () => {
		it("should remove a column", () => {
			const column: SankeyColumn = {
				id: "column-to-remove",
				columnLabel: "Remove Me",
				rows: []
			};

			dataStore.addColumn(column);
			expect(dataStore.data["column-to-remove"]).toBeDefined();

			dataStore.removeColumn(column);
			expect(dataStore.data["column-to-remove"]).toBeUndefined();
		});

		it("should not affect other columns when removing one", () => {
			const column1: SankeyColumn = {
				id: "column-1",
				columnLabel: "Keep Me",
				rows: []
			};

			const column2: SankeyColumn = {
				id: "column-2",
				columnLabel: "Remove Me",
				rows: []
			};

			dataStore.addColumn(column1);
			dataStore.addColumn(column2);

			dataStore.removeColumn(column2);

			expect(dataStore.data["column-1"]).toBeDefined();
			expect(dataStore.data["column-2"]).toBeUndefined();
		});

		it("should handle removing non-existent column gracefully", () => {
			const column: SankeyColumn = {
				id: "non-existent",
				columnLabel: "Does Not Exist",
				rows: []
			};

			// Should not throw error
			expect(() => dataStore.removeColumn(column)).not.toThrow();
			expect(dataStore.data["non-existent"]).toBeUndefined();
		});
	});

	describe("data property access", () => {
		it("should access columns through data property", () => {
			const column: SankeyColumn = {
				id: "test-access",
				columnLabel: "Access Test",
				rows: [
					{
						items: [{ id: "item-1", label: "Test Item" }]
					}
				]
			};

			dataStore.addColumn(column);

			expect(dataStore.data["test-access"].columnLabel).toBe("Access Test");
			expect(dataStore.data["test-access"].rows).toHaveLength(1);
			expect(dataStore.data["test-access"].rows[0].items).toHaveLength(1);
		});
	});

	describe("state consistency", () => {
		it("should maintain state consistency across multiple operations", () => {
			const column1: SankeyColumn = {
				id: "column-1",
				columnLabel: "First",
				rows: []
			};

			const column2: SankeyColumn = {
				id: "column-2",
				columnLabel: "Second",
				rows: []
			};

			const column3: SankeyColumn = {
				id: "column-3",
				columnLabel: "Third",
				rows: []
			};

			// Add columns
			dataStore.addColumn(column1);
			dataStore.addColumn(column2);
			dataStore.addColumn(column3);

			expect(Object.keys(dataStore.data)).toHaveLength(3);

			// Remove middle column
			dataStore.removeColumn(column2);

			expect(Object.keys(dataStore.data)).toHaveLength(2);
			expect(dataStore.data["column-1"]).toBeDefined();
			expect(dataStore.data["column-2"]).toBeUndefined();
			expect(dataStore.data["column-3"]).toBeDefined();

			// Update remaining column
			const updatedColumn1: SankeyColumn = {
				id: "column-1",
				columnLabel: "Updated First",
				rows: [{ items: [] }]
			};

			dataStore.addColumn(updatedColumn1);

			expect(dataStore.data["column-1"].columnLabel).toBe("Updated First");
			expect(dataStore.data["column-3"].columnLabel).toBe("Third");
		});
	});
});
