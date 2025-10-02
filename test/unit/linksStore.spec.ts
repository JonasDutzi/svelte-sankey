import { describe, it, expect, beforeEach } from "vitest";
import { linksStore } from "../../src/lib/stores/links.svelte";
import type { Link } from "../../src/lib/stores/links.svelte";

describe("LinksStore", () => {
	beforeEach(() => {
		// Clear the store before each test
		linksStore.data = {};
	});

	describe("initial state", () => {
		it("should start with empty data", () => {
			expect(linksStore.data).toEqual({});
		});
	});

	describe("add method", () => {
		it("should add a link", () => {
			const link: Link = {
				source: "source-1",
				target: "target-1",
				value: 100,
				strokeColor: "#ff0000",
				strokeColorHover: "#ff5555",
				ariaLabel: "Test Link"
			};

			linksStore.add(link);

			const key = "source-1/target-1";
			expect(linksStore.data[key]).toEqual({
				source: "source-1",
				target: "target-1",
				value: 100,
				strokeColor: "#ff0000",
				strokeColorHover: "#ff5555",
				ariaLabel: "Test Link"
			});
		});

		it("should add a link with minimal properties", () => {
			const link: Link = {
				source: "source-2",
				target: "target-2",
				value: 50
			};

			linksStore.add(link);

			const key = "source-2/target-2";
			expect(linksStore.data[key]).toEqual({
				source: "source-2",
				target: "target-2",
				value: 50,
				strokeColor: undefined,
				strokeColorHover: undefined,
				ariaLabel: undefined
			});
		});

		it("should handle zero value", () => {
			const link: Link = {
				source: "source-3",
				target: "target-3",
				value: 0
			};

			linksStore.add(link);

			const key = "source-3/target-3";
			expect(linksStore.data[key].value).toBe(0);
		});

		it("should handle negative value by setting to zero", () => {
			const link: Link = {
				source: "source-4",
				target: "target-4",
				value: -10
			};

			linksStore.add(link);

			const key = "source-4/target-4";
			expect(linksStore.data[key].value).toBe(0);
		});

		it("should update an existing link", () => {
			const link1: Link = {
				source: "source-1",
				target: "target-1",
				value: 100,
				strokeColor: "#ff0000"
			};

			const link2: Link = {
				source: "source-1",
				target: "target-1",
				value: 200,
				strokeColor: "#00ff00"
			};

			linksStore.add(link1);
			linksStore.add(link2);

			const key = "source-1/target-1";
			expect(linksStore.data[key].value).toBe(200);
			expect(linksStore.data[key].strokeColor).toBe("#00ff00");
		});

		it("should add multiple different links", () => {
			const link1: Link = {
				source: "source-1",
				target: "target-1",
				value: 100
			};

			const link2: Link = {
				source: "source-2",
				target: "target-2",
				value: 200
			};

			linksStore.add(link1);
			linksStore.add(link2);

			expect(Object.keys(linksStore.data)).toHaveLength(2);
			expect(linksStore.data["source-1/target-1"]).toBeDefined();
			expect(linksStore.data["source-2/target-2"]).toBeDefined();
		});
	});

	describe("remove method", () => {
		it("should remove a link", () => {
			const link: Link = {
				source: "source-to-remove",
				target: "target-to-remove",
				value: 100
			};

			linksStore.add(link);
			const key = "source-to-remove/target-to-remove";
			expect(linksStore.data[key]).toBeDefined();

			linksStore.remove(link);
			expect(linksStore.data[key]).toBeUndefined();
		});

		it("should not affect other links when removing one", () => {
			const link1: Link = {
				source: "source-1",
				target: "target-1",
				value: 100
			};

			const link2: Link = {
				source: "source-2",
				target: "target-2",
				value: 200
			};

			linksStore.add(link1);
			linksStore.add(link2);

			linksStore.remove(link2);

			expect(linksStore.data["source-1/target-1"]).toBeDefined();
			expect(linksStore.data["source-2/target-2"]).toBeUndefined();
		});

		it("should handle removing non-existent link gracefully", () => {
			const link: Link = {
				source: "non-existent-source",
				target: "non-existent-target",
				value: 100
			};

			// Should not throw error
			expect(() => linksStore.remove(link)).not.toThrow();
			expect(linksStore.data["non-existent-source/non-existent-target"]).toBeUndefined();
		});
	});

	describe("data property access", () => {
		it("should access links through data property", () => {
			const link: Link = {
				source: "test-source",
				target: "test-target",
				value: 150,
				strokeColor: "#blue",
				ariaLabel: "Test access link"
			};

			linksStore.add(link);

			const key = "test-source/test-target";
			expect(linksStore.data[key].source).toBe("test-source");
			expect(linksStore.data[key].target).toBe("test-target");
			expect(linksStore.data[key].value).toBe(150);
			expect(linksStore.data[key].strokeColor).toBe("#blue");
			expect(linksStore.data[key].ariaLabel).toBe("Test access link");
		});

		it("should return undefined for non-existent link", () => {
			expect(linksStore.data["non-existent/link"]).toBeUndefined();
		});
	});

	describe("state consistency", () => {
		it("should maintain state consistency across multiple operations", () => {
			const link1: Link = {
				source: "source-1",
				target: "target-1",
				value: 100,
				strokeColor: "#red"
			};

			const link2: Link = {
				source: "source-2",
				target: "target-2",
				value: 200,
				strokeColor: "#blue"
			};

			const link3: Link = {
				source: "source-3",
				target: "target-3",
				value: 300,
				strokeColor: "#green"
			};

			// Add links
			linksStore.add(link1);
			linksStore.add(link2);
			linksStore.add(link3);

			expect(Object.keys(linksStore.data)).toHaveLength(3);

			// Remove middle link
			linksStore.remove(link2);

			expect(Object.keys(linksStore.data)).toHaveLength(2);
			expect(linksStore.data["source-1/target-1"]).toBeDefined();
			expect(linksStore.data["source-2/target-2"]).toBeUndefined();
			expect(linksStore.data["source-3/target-3"]).toBeDefined();

			// Update remaining link
			const updatedLink1: Link = {
				source: "source-1",
				target: "target-1",
				value: 150,
				strokeColor: "#purple"
			};

			linksStore.add(updatedLink1);

			expect(linksStore.data["source-1/target-1"].value).toBe(150);
			expect(linksStore.data["source-1/target-1"].strokeColor).toBe("#purple");
			expect(linksStore.data["source-3/target-3"].value).toBe(300);
			expect(linksStore.data["source-3/target-3"].strokeColor).toBe("#green");
		});
	});
});
