import { describe, it, expect, beforeEach } from "vitest";
import { sankeyStore } from "../../src/lib/stores/sankey.svelte";
import type { Sankey } from "../../src/lib/stores/sankey.svelte";

describe("SankeyStore", () => {
	beforeEach(() => {
		// Reset the store to initial state before each test
		sankeyStore.reset();
	});

	describe("initial state", () => {
		it("should have correct default values", () => {
			expect(sankeyStore.minPathHeight).toBe(1);
			expect(sankeyStore.maxPathHeight).toBe(0);
			expect(sankeyStore.minValue).toBe(0);
			expect(sankeyStore.maxValue).toBe(0);
			expect(sankeyStore.isLoading).toBe(true);
			expect(sankeyStore.highlightPaths).toBe(true);
		});
	});

	describe("property getters and setters", () => {
		it("should set and get minPathHeight", () => {
			sankeyStore.minPathHeight = 5;
			expect(sankeyStore.minPathHeight).toBe(5);
		});

		it("should set and get maxPathHeight", () => {
			sankeyStore.maxPathHeight = 50;
			expect(sankeyStore.maxPathHeight).toBe(50);
		});

		it("should set and get minValue", () => {
			sankeyStore.minValue = 10;
			expect(sankeyStore.minValue).toBe(10);
		});

		it("should set and get maxValue", () => {
			sankeyStore.maxValue = 100;
			expect(sankeyStore.maxValue).toBe(100);
		});

		it("should set and get isLoading", () => {
			sankeyStore.isLoading = false;
			expect(sankeyStore.isLoading).toBe(false);
		});

		it("should set and get highlightPaths", () => {
			sankeyStore.highlightPaths = false;
			expect(sankeyStore.highlightPaths).toBe(false);

			sankeyStore.highlightPaths = undefined;
			expect(sankeyStore.highlightPaths).toBe(undefined);
		});
	});

	describe("set method", () => {
		it("should replace the entire state", () => {
			const newState: Sankey = {
				minPathHeight: 2,
				maxPathHeight: 40,
				minValue: 5,
				maxValue: 200,
				isLoading: false,
				highlightPaths: false
			};

			sankeyStore.set(newState);

			expect(sankeyStore.minPathHeight).toBe(2);
			expect(sankeyStore.maxPathHeight).toBe(40);
			expect(sankeyStore.minValue).toBe(5);
			expect(sankeyStore.maxValue).toBe(200);
			expect(sankeyStore.isLoading).toBe(false);
			expect(sankeyStore.highlightPaths).toBe(false);
		});
	});

	describe("setLoading method", () => {
		it("should set isLoading property", () => {
			sankeyStore.setLoading(false);
			expect(sankeyStore.isLoading).toBe(false);

			sankeyStore.setLoading(true);
			expect(sankeyStore.isLoading).toBe(true);
		});
	});

	describe("update method", () => {
		it("should update state using an updater function", () => {
			// Set initial values
			sankeyStore.minValue = 10;
			sankeyStore.maxValue = 50;

			// Update using updater function
			sankeyStore.update((current) => ({
				...current,
				minValue: current.minValue + 5,
				maxValue: current.maxValue * 2,
				isLoading: false
			}));

			expect(sankeyStore.minValue).toBe(15);
			expect(sankeyStore.maxValue).toBe(100);
			expect(sankeyStore.isLoading).toBe(false);
		});

		it("should preserve unchanged properties in update", () => {
			sankeyStore.minPathHeight = 3;
			sankeyStore.highlightPaths = false;

			sankeyStore.update((current) => ({
				...current,
				maxValue: 75
			}));

			expect(sankeyStore.minPathHeight).toBe(3);
			expect(sankeyStore.highlightPaths).toBe(false);
			expect(sankeyStore.maxValue).toBe(75);
		});
	});

	describe("reset method", () => {
		it("should reset all properties to initial state", () => {
			// Change all properties
			sankeyStore.minPathHeight = 10;
			sankeyStore.maxPathHeight = 100;
			sankeyStore.minValue = 20;
			sankeyStore.maxValue = 500;
			sankeyStore.isLoading = false;
			sankeyStore.highlightPaths = false;

			// Reset
			sankeyStore.reset();

			// Check all properties are back to initial state
			expect(sankeyStore.minPathHeight).toBe(1);
			expect(sankeyStore.maxPathHeight).toBe(0);
			expect(sankeyStore.minValue).toBe(0);
			expect(sankeyStore.maxValue).toBe(0);
			expect(sankeyStore.isLoading).toBe(true);
			expect(sankeyStore.highlightPaths).toBe(true);
		});
	});

	describe("state consistency", () => {
		it("should maintain state consistency across multiple operations", () => {
			// Perform multiple operations
			sankeyStore.minPathHeight = 2;
			sankeyStore.update((current) => ({ ...current, maxPathHeight: 60 }));
			sankeyStore.setLoading(false);
			sankeyStore.highlightPaths = false;

			// Verify all changes are preserved
			expect(sankeyStore.minPathHeight).toBe(2);
			expect(sankeyStore.maxPathHeight).toBe(60);
			expect(sankeyStore.isLoading).toBe(false);
			expect(sankeyStore.highlightPaths).toBe(false);
		});
	});
});
