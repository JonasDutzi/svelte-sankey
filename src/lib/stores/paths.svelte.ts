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

const createPathsStore = () => {
    const getPaths = () => {
        const paths: PathsStore = {};
        if (Object.entries(linksStore.value).length > 0) {
            const targetPositionMap = new Map<SankeyKey, number>();
            const sourcePositionMap = new Map<SankeyKey, number>();
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
                            y: sourceAnchor?.positionY + (sourcePositionMap.get(linkData.source) ?? 0)
                        },
                        targetPosition: {
                            x: targetAnchor?.positionX,
                            y: targetAnchor?.positionY + (targetPositionMap.get(linkData.target) ?? 0)
                        },
                        strokeColor: linkData.strokeColor,
                        strokeColorHover: linkData.strokeColorHover
                    };
                    if (targetPositionMap.has(linkData.target)) {
                        targetPositionMap.set(linkData.target, scaledLinkValue + targetPositionMap.get(linkData.target)!);
                    } else {
                        targetPositionMap.set(linkData.target, scaledLinkValue);
                    }
                    if (sourcePositionMap.has(linkData.source)) {
                        sourcePositionMap.set(linkData.source, scaledLinkValue + sourcePositionMap.get(linkData.source)!);
                    } else {
                        sourcePositionMap.set(linkData.source, scaledLinkValue);
                    }
                }
            }
        }
        return paths;
    };

    let paths = $derived(getPaths());
    return {
        get value() {
            return paths;
        }
    };
};

export const pathsStore = createPathsStore();
