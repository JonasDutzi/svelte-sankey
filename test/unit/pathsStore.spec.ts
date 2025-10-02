import { describe, it, expect, beforeEach, vi } from "vitest";
import { pathsStore } from "../../src/lib/stores/paths.svelte";
import { anchorsStore } from "../../src/lib/stores/anchors.svelte";
import { linksStore } from "../../src/lib/stores/links.svelte";
import { sankeyStore } from "../../src/lib/stores/sankey.svelte";
import { scaleValue } from "../../src/lib/helper";
import type { NewAnchor } from "../../src/lib/stores/anchors.svelte";
import type { Link } from "../../src/lib/stores/links.svelte";

// Mock the scaleValue function
vi.mock("../../src/lib/helper", () => ({
	scaleValue: vi.fn()
}));

describe("PathsStore", () => {
	beforeEach(() => {
		// Clear all related stores before each test
		anchorsStore.data = {};
		linksStore.data = {};

		// Reset sankey store to default values
		sankeyStore.data = {
			minPathHeight: 1,
			maxPathHeight: 10,
			minValue: 0,
			maxValue: 100,
			isLoading: false,
			highlightPaths: true
		};

		// Clear mock calls
		vi.clearAllMocks();

		// Default mock implementation for scaleValue
		vi.mocked(scaleValue).mockImplementation((value: number) => value * 0.1);
	});

	describe("initial state", () => {
		it("should start with empty paths when no links exist", () => {
			expect(pathsStore.data).toEqual({});
		});
	});

	describe("getPaths method", () => {
		it("should return empty paths when no links exist", () => {
			// Add some anchors but no links
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			expect(pathsStore.data).toEqual({});
		});

		it("should return empty paths when links exist but anchors don't", () => {
			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			expect(pathsStore.data).toEqual({});
		});

		it("should create paths when both links and anchors exist", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup links
			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 50,
					strokeColor: "#ff0000",
					strokeColorHover: "#ff5555"
				}
			];

			links.forEach((link) => linksStore.add(link));

			const paths = pathsStore.data;
			const linkKey = "anchor1/anchor2";

			expect(paths[linkKey]).toEqual({
				sourcePosition: {
					x: 100,
					y: 200
				},
				targetPosition: {
					x: 300,
					y: 250
				},
				strokeColor: "#ff0000",
				strokeColorHover: "#ff5555"
			});

			// Verify scaleValue was called
			expect(scaleValue).toHaveBeenCalledWith(50, [1, 10], 0, 100);
		});

		it("should handle multiple paths with position stacking", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "source1",
					positionX: 100,
					positionY: 100
				},
				{
					id: "source2",
					positionX: 100,
					positionY: 200
				},
				{
					id: "target1",
					positionX: 300,
					positionY: 150
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup multiple links targeting the same anchor
			const links: Link[] = [
				{
					source: "source1",
					target: "target1",
					value: 30
				},
				{
					source: "source2",
					target: "target1",
					value: 20
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Mock scaleValue to return predictable values
			vi.mocked(scaleValue).mockImplementation((value: number) => value);

			const paths = pathsStore.data;

			// First path should be at base position
			expect(paths["source1/target1"]).toEqual({
				sourcePosition: {
					x: 100,
					y: 100 // base position
				},
				targetPosition: {
					x: 300,
					y: 150 // base position
				},
				strokeColor: undefined,
				strokeColorHover: undefined
			});

			// Second path should be offset by the first path's scaled value
			expect(paths["source2/target1"]).toEqual({
				sourcePosition: {
					x: 100,
					y: 200 // base position
				},
				targetPosition: {
					x: 300,
					y: 180 // 150 + 30 (scaled value of first path)
				},
				strokeColor: undefined,
				strokeColorHover: undefined
			});
		});

		it("should handle paths with same source but different targets", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "source1",
					positionX: 100,
					positionY: 100
				},
				{
					id: "target1",
					positionX: 300,
					positionY: 150
				},
				{
					id: "target2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup multiple links from the same source
			const links: Link[] = [
				{
					source: "source1",
					target: "target1",
					value: 40
				},
				{
					source: "source1",
					target: "target2",
					value: 60
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Mock scaleValue to return predictable values
			vi.mocked(scaleValue).mockImplementation((value: number) => value);

			const paths = pathsStore.data;

			// First path should be at base position
			expect(paths["source1/target1"]).toEqual({
				sourcePosition: {
					x: 100,
					y: 100 // base position
				},
				targetPosition: {
					x: 300,
					y: 150 // base position
				},
				strokeColor: undefined,
				strokeColorHover: undefined
			});

			// Second path should be offset from the source
			expect(paths["source1/target2"]).toEqual({
				sourcePosition: {
					x: 100,
					y: 140 // 100 + 40 (scaled value of first path)
				},
				targetPosition: {
					x: 300,
					y: 250 // base position
				},
				strokeColor: undefined,
				strokeColorHover: undefined
			});
		});

		it("should skip paths when source anchor is missing", () => {
			// Setup only target anchor
			const anchors: NewAnchor[] = [
				{
					id: "target1",
					positionX: 300,
					positionY: 150
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup link with missing source
			const links: Link[] = [
				{
					source: "missing_source",
					target: "target1",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			expect(pathsStore.data).toEqual({});
		});

		it("should skip paths when target anchor is missing", () => {
			// Setup only source anchor
			const anchors: NewAnchor[] = [
				{
					id: "source1",
					positionX: 100,
					positionY: 100
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup link with missing target
			const links: Link[] = [
				{
					source: "source1",
					target: "missing_target",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			expect(pathsStore.data).toEqual({});
		});

		it("should handle paths with custom stroke colors", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup links with custom colors
			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 50,
					strokeColor: "#00ff00",
					strokeColorHover: "#55ff55"
				}
			];

			links.forEach((link) => linksStore.add(link));

			const paths = pathsStore.data;
			const linkKey = "anchor1/anchor2";

			expect(paths[linkKey].strokeColor).toBe("#00ff00");
			expect(paths[linkKey].strokeColorHover).toBe("#55ff55");
		});

		it("should handle paths without stroke colors", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup links without colors
			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			const paths = pathsStore.data;
			const linkKey = "anchor1/anchor2";

			expect(paths[linkKey].strokeColor).toBeUndefined();
			expect(paths[linkKey].strokeColorHover).toBeUndefined();
		});

		it("should handle zero value paths", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup links with zero value
			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 0
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Mock scaleValue to handle zero
			vi.mocked(scaleValue).mockImplementation((value: number) => (value === 0 ? 0 : value * 0.1));

			const paths = pathsStore.data;
			const linkKey = "anchor1/anchor2";

			expect(paths[linkKey]).toBeDefined();
			expect(scaleValue).toHaveBeenCalledWith(0, [1, 10], 0, 100);
		});

		it("should use sankey store values for scaling", () => {
			// Update sankey store values
			sankeyStore.minPathHeight = 5;
			sankeyStore.maxPathHeight = 20;
			sankeyStore.minValue = 10;
			sankeyStore.maxValue = 200;

			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Setup links
			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 75
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Trigger path calculation
			void pathsStore.data;

			// Verify scaleValue was called with updated sankey store values
			expect(scaleValue).toHaveBeenCalledWith(75, [5, 20], 10, 200);
		});
	});

	describe("reactive updates", () => {
		it("should update paths when anchors change", () => {
			// Setup initial data
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Initially should have the path
			expect(pathsStore.data["anchor1/anchor2"]).toBeDefined();

			// Remove an anchor
			delete anchorsStore.data["anchor1"];

			// Path should no longer exist
			expect(pathsStore.data["anchor1/anchor2"]).toBeUndefined();
		});

		it("should update paths when links change", () => {
			// Setup anchors
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			// Initially no paths
			expect(pathsStore.data).toEqual({});

			// Add a link
			const link: Link = {
				source: "anchor1",
				target: "anchor2",
				value: 50
			};

			linksStore.add(link);

			// Should now have a path
			expect(pathsStore.data["anchor1/anchor2"]).toBeDefined();
		});

		it("should update paths when sankey store values change", () => {
			// Setup initial data
			const anchors: NewAnchor[] = [
				{
					id: "anchor1",
					positionX: 100,
					positionY: 200
				},
				{
					id: "anchor2",
					positionX: 300,
					positionY: 250
				}
			];

			anchors.forEach((anchor) => anchorsStore.add(anchor));

			const links: Link[] = [
				{
					source: "anchor1",
					target: "anchor2",
					value: 50
				}
			];

			links.forEach((link) => linksStore.add(link));

			// Clear previous calls
			vi.clearAllMocks();

			// Change sankey store values
			sankeyStore.minPathHeight = 2;
			sankeyStore.maxPathHeight = 15;

			// Trigger path recalculation by accessing data
			void pathsStore.data;

			// Verify scaleValue was called with new values
			expect(scaleValue).toHaveBeenCalledWith(50, [2, 15], 0, 100);
		});
	});
});
