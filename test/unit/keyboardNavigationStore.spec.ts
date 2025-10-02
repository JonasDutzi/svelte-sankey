import { describe, it, expect, beforeEach, vi } from "vitest";
import { keyboardNavStore } from "../../src/lib/stores/keyboardNavigation.svelte";
import { dataStore } from "../../src/lib/stores/data.svelte";
import type { SankeyColumn } from "../../src/lib/types";

// Mock document methods
const mockQuerySelector = vi.fn();
Object.defineProperty(document, "querySelector", {
	value: mockQuerySelector,
	writable: true
});

Object.defineProperty(document.documentElement, "dir", {
	value: "ltr",
	writable: true,
	configurable: true
});

describe("KeyboardNavigationStore", () => {
	beforeEach(() => {
		// Clear all related stores before each test
		dataStore.data = {};
		keyboardNavStore.focusedItemId = null;
		keyboardNavStore.currentColumnIndex = 0;
		keyboardNavStore.currentItemIndex = 0;

		// Reset mocks
		vi.clearAllMocks();
		mockQuerySelector.mockReturnValue(null);

		// Reset document direction to LTR
		Object.defineProperty(document.documentElement, "dir", {
			value: "ltr",
			writable: true,
			configurable: true
		});
	});

	describe("initial state", () => {
		it("should start with no focused item", () => {
			expect(keyboardNavStore.focusedItemId).toBeNull();
			expect(keyboardNavStore.currentColumnIndex).toBe(0);
			expect(keyboardNavStore.currentItemIndex).toBe(0);
		});

		it("should have empty navigation grid when no data", () => {
			expect(keyboardNavStore.navGrid.columns).toEqual([]);
		});
	});

	describe("navGrid derived state", () => {
		it("should build navigation grid from data store", () => {
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
									links: [{ target: "item2", value: 10 }]
								}
							]
						}
					]
				},
				{
					id: "column2",
					columnLabel: "Column 2",
					rows: [
						{
							rowLabel: "Row 2",
							items: [{ id: "item2", label: "Item 2" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const navGrid = keyboardNavStore.navGrid;

			expect(navGrid.columns).toHaveLength(2);
			expect(navGrid.columns[0].columnKey).toBe("column1");
			expect(navGrid.columns[0].items).toHaveLength(2); // anchor + path

			// Check anchor item
			expect(navGrid.columns[0].items[0]).toEqual({
				id: "item1",
				type: "anchor",
				rowIndex: 0,
				itemIndex: 0
			});

			// Check path item
			expect(navGrid.columns[0].items[1]).toEqual({
				id: "item1/item2",
				type: "path",
				rowIndex: 0,
				itemIndex: 0,
				sourceId: "item1",
				targetId: "item2"
			});

			// Check second column
			expect(navGrid.columns[1].columnKey).toBe("column2");
			expect(navGrid.columns[1].items).toHaveLength(1); // only anchor
			expect(navGrid.columns[1].items[0]).toEqual({
				id: "item2",
				type: "anchor",
				rowIndex: 0,
				itemIndex: 0
			});
		});

		it("should handle items without links", () => {
			const columns: SankeyColumn[] = [
				{
					id: "column1",
					columnLabel: "Column 1",
					rows: [
						{
							rowLabel: "Row 1",
							items: [
								{ id: "item1", label: "Item 1" } // No links
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const navGrid = keyboardNavStore.navGrid;

			expect(navGrid.columns[0].items).toHaveLength(1); // only anchor
			expect(navGrid.columns[0].items[0]).toEqual({
				id: "item1",
				type: "anchor",
				rowIndex: 0,
				itemIndex: 0
			});
		});
	});

	describe("findItemPosition", () => {
		beforeEach(() => {
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
									links: [{ target: "item2", value: 10 }]
								}
							]
						}
					]
				},
				{
					id: "column2",
					columnLabel: "Column 2",
					rows: [
						{
							rowLabel: "Row 2",
							items: [{ id: "item2", label: "Item 2" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));
		});

		it("should find position of existing item", () => {
			const position = keyboardNavStore.findItemPosition("item1");
			expect(position).toEqual({ columnIndex: 0, itemIndex: 0 });

			const position2 = keyboardNavStore.findItemPosition("item2");
			expect(position2).toEqual({ columnIndex: 1, itemIndex: 0 });
		});

		it("should return null for non-existent item", () => {
			const position = keyboardNavStore.findItemPosition("nonexistent");
			expect(position).toBeNull();
		});

		it("should find position of path item", () => {
			const position = keyboardNavStore.findItemPosition("item1/item2");
			expect(position).toEqual({ columnIndex: 0, itemIndex: 1 });
		});
	});

	describe("setFocusedItem", () => {
		beforeEach(() => {
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
		});

		it("should set focused item and update position", () => {
			keyboardNavStore.setFocusedItem("item1");

			expect(keyboardNavStore.focusedItemId).toBe("item1");
			expect(keyboardNavStore.currentColumnIndex).toBe(0);
			expect(keyboardNavStore.currentItemIndex).toBe(0);
		});

		it("should not update position for non-existent item", () => {
			keyboardNavStore.setFocusedItem("nonexistent");

			expect(keyboardNavStore.focusedItemId).toBeNull();
			expect(keyboardNavStore.currentColumnIndex).toBe(0);
			expect(keyboardNavStore.currentItemIndex).toBe(0);
		});
	});

	describe("getCurrentFocusedItem", () => {
		beforeEach(() => {
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
		});

		it("should return current focused item", () => {
			keyboardNavStore.setFocusedItem("item1");
			const currentItem = keyboardNavStore.getCurrentFocusedItem();

			expect(currentItem).toEqual({
				id: "item1",
				type: "anchor",
				rowIndex: 0,
				itemIndex: 0
			});
		});

		it("should return null when no item is focused", () => {
			// Ensure we have no data
			dataStore.data = {};

			const currentItem = keyboardNavStore.getCurrentFocusedItem();
			expect(currentItem).toBeNull();
		});

		it("should return null when position is invalid", () => {
			keyboardNavStore.currentColumnIndex = -1;
			keyboardNavStore.currentItemIndex = -1;

			const currentItem = keyboardNavStore.getCurrentFocusedItem();
			expect(currentItem).toBeNull();
		});
	});

	describe("isItemInteractive", () => {
		it("should return true for interactive elements", () => {
			const mockElement = {
				getAttribute: vi.fn().mockReturnValue("button")
			};
			mockQuerySelector.mockReturnValue(mockElement);

			const result = keyboardNavStore.isItemInteractive("item1");
			expect(result).toBe(true);
			expect(mockQuerySelector).toHaveBeenCalledWith('[data-item-id="item1"]');
			expect(mockElement.getAttribute).toHaveBeenCalledWith("role");
		});

		it("should return false for non-interactive elements", () => {
			const mockElement = {
				getAttribute: vi.fn().mockReturnValue("presentation")
			};
			mockQuerySelector.mockReturnValue(mockElement);

			const result = keyboardNavStore.isItemInteractive("item1");
			expect(result).toBe(false);
		});

		it("should return false when element does not exist", () => {
			mockQuerySelector.mockReturnValue(null);

			const result = keyboardNavStore.isItemInteractive("item1");
			expect(result).toBe(false);
		});
	});

	describe("initializeFocus", () => {
		it("should focus on first anchor when data exists", () => {
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
									links: [{ target: "item2", value: 10 }]
								}
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const result = keyboardNavStore.initializeFocus();

			expect(result).toBe("item1");
			expect(keyboardNavStore.focusedItemId).toBe("item1");
			expect(keyboardNavStore.currentColumnIndex).toBe(0);
			expect(keyboardNavStore.currentItemIndex).toBe(0);
		});

		it("should return null when no data exists", () => {
			const result = keyboardNavStore.initializeFocus();

			expect(result).toBeNull();
			expect(keyboardNavStore.focusedItemId).toBeNull();
		});
	});

	describe("clearFocus", () => {
		it("should clear focused item", () => {
			keyboardNavStore.focusedItemId = "item1";
			keyboardNavStore.clearFocus();

			expect(keyboardNavStore.focusedItemId).toBeNull();
		});
	});

	describe("getFirstFocusableItemId", () => {
		it("should return first anchor ID when data exists", () => {
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
									links: [{ target: "item2", value: 10 }]
								}
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));

			const result = keyboardNavStore.getFirstFocusableItemId();
			expect(result).toBe("item1");
		});

		it("should return null when no data exists", () => {
			const result = keyboardNavStore.getFirstFocusableItemId();
			expect(result).toBeNull();
		});
	});

	describe("direction handling", () => {
		it("should detect LTR direction", () => {
			Object.defineProperty(document.documentElement, "dir", {
				value: "ltr",
				writable: true,
				configurable: true
			});

			expect(keyboardNavStore.getDocumentDirection()).toBe("ltr");
			expect(keyboardNavStore.isRTLDirection()).toBe(false);
		});

		it("should detect RTL direction", () => {
			Object.defineProperty(document.documentElement, "dir", {
				value: "rtl",
				writable: true,
				configurable: true
			});

			expect(keyboardNavStore.getDocumentDirection()).toBe("rtl");
			expect(keyboardNavStore.isRTLDirection()).toBe(true);
		});
	});

	describe("navigation", () => {
		beforeEach(() => {
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
				},
				{
					id: "column2",
					columnLabel: "Column 2",
					rows: [
						{
							rowLabel: "Row 2",
							items: [
								{ id: "item3", label: "Item 3" },
								{ id: "item4", label: "Item 4" }
							]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));
		});

		describe("navigateVertical", () => {
			it("should navigate down between anchors", () => {
				keyboardNavStore.setFocusedItem("item1");

				const result = keyboardNavStore.navigateVertical("down");
				expect(result).toBe("item2");
				expect(keyboardNavStore.focusedItemId).toBe("item2");
			});

			it("should navigate up between anchors", () => {
				keyboardNavStore.setFocusedItem("item2");

				const result = keyboardNavStore.navigateVertical("up");
				expect(result).toBe("item1");
				expect(keyboardNavStore.focusedItemId).toBe("item1");
			});

			it("should return null when at boundaries", () => {
				keyboardNavStore.setFocusedItem("item1");

				const result = keyboardNavStore.navigateVertical("up");
				expect(result).toBeNull();
			});

			it("should initialize focus when no item is focused", () => {
				const result = keyboardNavStore.navigateVertical("down");
				expect(result).toBe("item1");
				expect(keyboardNavStore.focusedItemId).toBe("item1");
			});

			it("should return null when no columns exist", () => {
				dataStore.data = {};

				const result = keyboardNavStore.navigateVertical("down");
				expect(result).toBeNull();
			});
		});

		describe("navigateHorizontal", () => {
			it("should navigate right to next column in LTR", () => {
				keyboardNavStore.setFocusedItem("item1");

				const result = keyboardNavStore.navigateHorizontal("right");
				expect(result).toBe("item3");
				expect(keyboardNavStore.focusedItemId).toBe("item3");
			});

			it("should navigate left to previous column in LTR", () => {
				keyboardNavStore.setFocusedItem("item3");

				const result = keyboardNavStore.navigateHorizontal("left");
				expect(result).toBe("item1");
				expect(keyboardNavStore.focusedItemId).toBe("item1");
			});

			it("should navigate left to next column in RTL", () => {
				Object.defineProperty(document.documentElement, "dir", {
					value: "rtl",
					writable: true,
					configurable: true
				});

				keyboardNavStore.setFocusedItem("item1");

				const result = keyboardNavStore.navigateHorizontal("left");
				expect(result).toBe("item3");
				expect(keyboardNavStore.focusedItemId).toBe("item3");
			});

			it("should return null when at boundaries", () => {
				keyboardNavStore.setFocusedItem("item1");

				const result = keyboardNavStore.navigateHorizontal("left");
				expect(result).toBeNull();
			});

			it("should initialize focus when no item is focused", () => {
				const result = keyboardNavStore.navigateHorizontal("right");
				expect(result).toBe("item1");
				expect(keyboardNavStore.focusedItemId).toBe("item1");
			});

			it("should return null when no columns exist", () => {
				dataStore.data = {};

				const result = keyboardNavStore.navigateHorizontal("right");
				expect(result).toBeNull();
			});
		});
	});

	describe("anchor and path finding", () => {
		beforeEach(() => {
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
									links: [{ target: "item2", value: 10 }]
								}
							]
						}
					]
				},
				{
					id: "column2",
					columnLabel: "Column 2",
					rows: [
						{
							rowLabel: "Row 2",
							items: [{ id: "item2", label: "Item 2" }]
						}
					]
				}
			];

			columns.forEach((column) => dataStore.addColumn(column));
		});

		it("should find anchor by ID", () => {
			const anchor = keyboardNavStore.findAnchorById("item1");
			expect(anchor).toEqual({
				id: "item1",
				type: "anchor",
				rowIndex: 0,
				itemIndex: 0
			});
		});

		it("should return null for non-existent anchor", () => {
			const anchor = keyboardNavStore.findAnchorById("nonexistent");
			expect(anchor).toBeNull();
		});

		it("should find path from anchor", () => {
			// Mock the path as interactive
			const mockElement = {
				getAttribute: vi.fn().mockReturnValue("button")
			};
			mockQuerySelector.mockReturnValue(mockElement);

			const path = keyboardNavStore.findPathFromAnchor("item1");
			expect(path).toEqual({
				id: "item1/item2",
				type: "path",
				rowIndex: 0,
				itemIndex: 0,
				sourceId: "item1",
				targetId: "item2"
			});
		});

		it("should find path to anchor", () => {
			// Mock the path as interactive
			const mockElement = {
				getAttribute: vi.fn().mockReturnValue("button")
			};
			mockQuerySelector.mockReturnValue(mockElement);

			const path = keyboardNavStore.findPathToAnchor("item2");
			expect(path).toEqual({
				id: "item1/item2",
				type: "path",
				rowIndex: 0,
				itemIndex: 0,
				sourceId: "item1",
				targetId: "item2"
			});
		});
	});
});
