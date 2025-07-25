import type { SankeyKey } from "../types/index.ts";
import { anchorsStore } from "./anchors.svelte.ts";
import { linksStore } from "./links.svelte.ts";
import { scaleValue } from "../helper.ts";
import { sankeyStore } from "./sankey.svelte.ts";

export type Path = {
	sourcePosition: Position;
	targetPosition: Position;
	strokeColor?: string;
	strokeColorHover?: string;
};

export type Position = {
	x: number | undefined;
	y: number | undefined;
};

export type PathsStore = Record<string, Path>;

type Positions = Record<SankeyKey, number>;

const createPathsStore = () => {
	const getPaths = () => {
		const paths: PathsStore = {};
		if (Object.entries(linksStore.value).length > 0) {
			const targetPositions: Positions = {};
			const sourcePositions: Positions = {};
			for (const [linkKey, linkData] of Object.entries(linksStore.value)) {
				const sourceAnchor = anchorsStore.value[linkData.source];
				const targetAnchor = anchorsStore.value[linkData.target];
				const scaledLinkValue = scaleValue(
					linkData.value,
					[sankeyStore.value.minPathHeight, sankeyStore.value.maxPathHeight],
					sankeyStore.value.minValue,
					sankeyStore.value.maxValue
				);
				if (sourceAnchor && targetAnchor) {
					paths[linkKey] = {
						sourcePosition: {
							x: sourceAnchor?.positionX,
							y: sourceAnchor?.positionY + (sourcePositions[linkData.source] ?? 0)
						},
						targetPosition: {
							x: targetAnchor?.positionX,
							y: targetAnchor?.positionY + (targetPositions[linkData.target] ?? 0)
						},
						strokeColor: linkData.strokeColor,
						strokeColorHover: linkData.strokeColorHover
					};
					if (targetPositions[linkData.target]) {
						targetPositions[linkData.target] = scaledLinkValue + targetPositions[linkData.target];
					} else {
						targetPositions[linkData.target] = scaledLinkValue;
					}
					if (sourcePositions[linkData.source]) {
						sourcePositions[linkData.source] = scaledLinkValue + sourcePositions[linkData.source];
					} else {
						sourcePositions[linkData.source] = scaledLinkValue;
					}
				}
			}
		}
		return paths;
	};

	const paths = $derived(getPaths());
	return {
		get value() {
			return paths;
		}
	};
};

export const pathsStore = createPathsStore();
