import { derived } from "svelte/store";

import type { SankeyKey } from "../types";
import { anchorsStore } from "./anchors";
import { linksStore } from "./links";
import { scaleValue } from "../helper";
import { sankeyStore } from "./sankey";

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

export type PathsStore = Map<string, PathsData>;
export type PathsData = Map<string, Path>;

const createPathsStore = () => {
    const { subscribe } = derived([anchorsStore, linksStore, sankeyStore], ([$anchorsStore, $linksStore, $sankeyStore]) => {
        const pathsData: PathsStore = new Map();
        const targetPositionMap = new Map<string, Map<SankeyKey, number>>();
        const sourcePositionMap = new Map<string, Map<SankeyKey, number>>();
        if ($linksStore?.size > 0 && $anchorsStore?.size > 0) {
            for (const [sankeyId, linkStore] of $linksStore.entries()) {
                const sankeyStore = $sankeyStore.get(sankeyId);
                if (!sourcePositionMap.has(sankeyId)) {
                    sourcePositionMap.set(sankeyId, new Map());
                }
                if (!targetPositionMap.has(sankeyId)) {
                    targetPositionMap.set(sankeyId, new Map());
                }

                for (const [linkKey, linkData] of linkStore.entries()) {
                    let sourceAnchor;
                    let targetAnchor;
                    if ($anchorsStore.has(sankeyId) && $anchorsStore.get(sankeyId).has(linkData.source)) {
                        sourceAnchor = $anchorsStore.get(sankeyId).get(linkData.source);
                    }
                    if ($anchorsStore.has(sankeyId) && $anchorsStore.get(sankeyId).has(linkData.target)) {
                        targetAnchor = $anchorsStore.get(sankeyId).get(linkData.target);
                    }
                    const scaledLinkValue = scaleValue(
                        linkData.value,
                        [sankeyStore.minPathHeight, sankeyStore.maxPathHeight],
                        sankeyStore.minValue,
                        sankeyStore.maxValue
                    );
                    if (sourceAnchor && targetAnchor) {
                        if (pathsData.has(sankeyId)) {
                            pathsData.get(sankeyId).set(linkKey, {
                                sourcePosition: {
                                    x: sourceAnchor?.positionX,
                                    y: sourceAnchor?.positionY + (sourcePositionMap.get(sankeyId).get(linkData.source) ?? 0)
                                },
                                targetPosition: {
                                    x: targetAnchor?.positionX,
                                    y: targetAnchor?.positionY + (targetPositionMap.get(sankeyId).get(linkData.target) ?? 0)
                                },
                                strokeColor: linkData.strokeColor,
                                strokeColorHover: linkData.strokeColorHover
                            });
                        } else {
                            const data: PathsData = new Map();
                            data.set(linkKey, {
                                sourcePosition: {
                                    x: sourceAnchor?.positionX,
                                    y: sourceAnchor?.positionY + (sourcePositionMap.get(sankeyId).get(linkData.source) ?? 0)
                                },
                                targetPosition: {
                                    x: targetAnchor?.positionX,
                                    y: targetAnchor?.positionY + (targetPositionMap.get(sankeyId).get(linkData.target) ?? 0)
                                },
                                strokeColor: linkData.strokeColor,
                                strokeColorHover: linkData.strokeColorHover
                            });
                            pathsData.set(sankeyId, data);
                        }

                        if (targetPositionMap.get(sankeyId).has(linkData.target)) {
                            targetPositionMap.get(sankeyId).set(linkData.target, scaledLinkValue + targetPositionMap.get(sankeyId).get(linkData.target));
                        } else {
                            const data = new Map<SankeyKey, number>();
                            data.set(linkData.target, scaledLinkValue);
                            targetPositionMap.set(sankeyId, data);
                        }
                        if (sourcePositionMap.get(sankeyId).has(linkData.source)) {
                            sourcePositionMap.get(sankeyId).set(linkData.source, scaledLinkValue + sourcePositionMap.get(sankeyId).get(linkData.source));
                        } else {
                            const data = new Map<SankeyKey, number>();
                            data.set(linkData.source, scaledLinkValue);
                            sourcePositionMap.set(sankeyId, data);
                        }
                    }
                }
            }
        }
        console.log("paths changed");
        return pathsData;
    });

    return {
        subscribe
    };
};

export const pathsStore = createPathsStore();
