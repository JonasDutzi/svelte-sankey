import { derived } from "svelte/store";

import type { SankeyKey } from "../types";
import { anchorsStore } from "./anchors";
import { linksStore } from "./links";
import { scaleValue } from "../helper";
import { sankeyStore } from "./sankey";

export type Path = {
    sourcePosition: Position;
    targetPosition: Position;
};

export type Position = {
    x: number | undefined;
    y: number | undefined;
};

export type PathsStore = Map<string, Path>;

const createPathsStore = () => {
    const { subscribe } = derived([anchorsStore, linksStore, sankeyStore], ([$anchorsStore, $linksStore, $sankeyStore]) => {
        const paths = new Map<string, Path>();
        if ($linksStore?.size > 0) {
            const targetPositionMap = new Map<SankeyKey, number>();
            const sourcePositionMap = new Map<SankeyKey, number>();
            for (const [linkKey, linkData] of $linksStore.entries()) {
                const sourceAnchor = $anchorsStore.get(linkData.source);
                const targetAnchor = $anchorsStore.get(linkData.target);
                const scaledLinkValue = scaleValue(
                    linkData.value,
                    [$sankeyStore.minPathHeight, $sankeyStore.maxPathHeight],
                    $sankeyStore.minValue,
                    $sankeyStore.maxValue
                );
                if (sourceAnchor && targetAnchor) {
                    paths.set(linkKey, {
                        sourcePosition: {
                            x: sourceAnchor?.positionX,
                            y: sourceAnchor?.positionY + (sourcePositionMap.get(linkData.source) ?? 0)
                        },
                        targetPosition: {
                            x: targetAnchor?.positionX,
                            y: targetAnchor?.positionY + (targetPositionMap.get(linkData.target) ?? 0)
                        }
                    });
                    if (targetPositionMap.has(linkData.target)) {
                        targetPositionMap.set(linkData.target, scaledLinkValue + targetPositionMap.get(linkData.target));
                    } else {
                        targetPositionMap.set(linkData.target, scaledLinkValue);
                    }
                    if (sourcePositionMap.has(linkData.source)) {
                        sourcePositionMap.set(linkData.source, scaledLinkValue + sourcePositionMap.get(linkData.source));
                    } else {
                        sourcePositionMap.set(linkData.source, scaledLinkValue);
                    }
                }
            }
        }
        return paths;
    });

    return {
        subscribe
    };
};

export const pathsStore = createPathsStore();
