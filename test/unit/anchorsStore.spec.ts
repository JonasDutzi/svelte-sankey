import { describe, it, expect, beforeEach } from "vitest";
import { anchorsStore } from "../../src/lib/stores/anchors.svelte";
import type { NewAnchor } from "../../src/lib/stores/anchors.svelte";

describe("AnchorsStore", () => {
	beforeEach(() => {
		// Clear the store before each test
		anchorsStore.data = {};
	});

	describe("initial state", () => {
		it("should start with empty data", () => {
			expect(anchorsStore.data).toEqual({});
		});
	});

	describe("add method", () => {
		it("should add an anchor", () => {
			const anchor: NewAnchor = {
				id: "test-anchor",
				positionX: 100,
				positionY: 200,
				anchorColor: "#ff0000"
			};

			anchorsStore.add(anchor);

			expect(anchorsStore.data["test-anchor"]).toEqual({
				positionX: 100,
				positionY: 200,
				anchorColor: "#ff0000"
			});
		});

		it("should add an anchor without color", () => {
			const anchor: NewAnchor = {
				id: "test-anchor-2",
				positionX: 150,
				positionY: 250
			};

			anchorsStore.add(anchor);

			expect(anchorsStore.data["test-anchor-2"]).toEqual({
				positionX: 150,
				positionY: 250,
				anchorColor: undefined
			});
		});

		it("should update an existing anchor", () => {
			const anchor1: NewAnchor = {
				id: "test-anchor",
				positionX: 100,
				positionY: 200,
				anchorColor: "#ff0000"
			};

			const anchor2: NewAnchor = {
				id: "test-anchor",
				positionX: 300,
				positionY: 400,
				anchorColor: "#00ff00"
			};

			anchorsStore.add(anchor1);
			anchorsStore.add(anchor2);

			expect(anchorsStore.data["test-anchor"]).toEqual({
				positionX: 300,
				positionY: 400,
				anchorColor: "#00ff00"
			});
		});

		it("should add multiple anchors", () => {
			const anchor1: NewAnchor = {
				id: "anchor-1",
				positionX: 100,
				positionY: 200
			};

			const anchor2: NewAnchor = {
				id: "anchor-2",
				positionX: 300,
				positionY: 400,
				anchorColor: "#blue"
			};

			anchorsStore.add(anchor1);
			anchorsStore.add(anchor2);

			expect(Object.keys(anchorsStore.data)).toHaveLength(2);
			expect(anchorsStore.data["anchor-1"]).toBeDefined();
			expect(anchorsStore.data["anchor-2"]).toBeDefined();
		});
	});

	describe("data property access", () => {
		it("should access anchors through data property", () => {
			const anchor: NewAnchor = {
				id: "test-access",
				positionX: 500,
				positionY: 600,
				anchorColor: "#purple"
			};

			anchorsStore.add(anchor);

			expect(anchorsStore.data["test-access"].positionX).toBe(500);
			expect(anchorsStore.data["test-access"].positionY).toBe(600);
			expect(anchorsStore.data["test-access"].anchorColor).toBe("#purple");
		});

		it("should return undefined for non-existent anchor", () => {
			expect(anchorsStore.data["non-existent"]).toBeUndefined();
		});
	});

	describe("state consistency", () => {
		it("should maintain state consistency across multiple operations", () => {
			const anchor1: NewAnchor = {
				id: "anchor-1",
				positionX: 100,
				positionY: 200,
				anchorColor: "#red"
			};

			const anchor2: NewAnchor = {
				id: "anchor-2",
				positionX: 300,
				positionY: 400,
				anchorColor: "#blue"
			};

			anchorsStore.add(anchor1);
			anchorsStore.add(anchor2);

			// Update first anchor
			anchorsStore.add({
				id: "anchor-1",
				positionX: 150,
				positionY: 250,
				anchorColor: "#green"
			});

			expect(anchorsStore.data["anchor-1"].positionX).toBe(150);
			expect(anchorsStore.data["anchor-1"].positionY).toBe(250);
			expect(anchorsStore.data["anchor-1"].anchorColor).toBe("#green");

			// Second anchor should remain unchanged
			expect(anchorsStore.data["anchor-2"].positionX).toBe(300);
			expect(anchorsStore.data["anchor-2"].positionY).toBe(400);
			expect(anchorsStore.data["anchor-2"].anchorColor).toBe("#blue");
		});
	});
});
