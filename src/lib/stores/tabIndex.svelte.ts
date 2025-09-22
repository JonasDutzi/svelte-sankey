import type { SankeyKey } from "../types/index.ts";
import { dataStore } from "./data.svelte.ts";
import { linksStore } from "./links.svelte.ts";

export type TabIndexStore = {
	anchors: Record<SankeyKey, number>;
	paths: Record<string, number>;
};

const createTabIndexStore = () => {
	const assignPathTabIndexes = (itemId: SankeyKey, pathsTabIndex: Record<string, number>, startIndex: number): number => {
		let currentIndex = startIndex;
		for (const [linkKey, linkData] of Object.entries(linksStore.value)) {
			if (linkData.source === itemId) {
				pathsTabIndex[linkKey] = currentIndex++;
			}
		}
		return currentIndex;
	};

	const getTabIndexes = (): TabIndexStore => {
		const tabIndexes: TabIndexStore = {
			anchors: {},
			paths: {}
		};

		let currentTabIndex = 1;

		// Process each column in order
		for (const columnData of Object.values(dataStore.value)) {
			for (const row of columnData.rows) {
				for (const item of row.items) {
					// Assign tabindex to the anchor
					tabIndexes.anchors[item.id] = currentTabIndex++;

					// Immediately assign tabindex to all outgoing paths from this anchor
					currentTabIndex = assignPathTabIndexes(item.id, tabIndexes.paths, currentTabIndex);
				}
			}
		}

		return tabIndexes;
	};

	const tabIndexes = $derived(getTabIndexes());

	return {
		get value() {
			return tabIndexes;
		}
	};
};

export const tabIndexStore = createTabIndexStore();
