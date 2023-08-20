import { derived } from "svelte/store";
import { anchorsStore, linksStore } from "./index";
import type { SankeyKey } from "../lib/types";

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
    const { subscribe } = derived([anchorsStore, linksStore], ([$anchorsStore, $linksStore]) => {
        const paths = new Map<string, Path>();
        if ($linksStore?.size > 0) {
            const targetPositionMap = new Map<SankeyKey, number>();
            const sourcePositionMap = new Map<SankeyKey, number>();
            for (const [linkKey, linkData] of $linksStore.entries()) {
                const sourceAnchor = $anchorsStore.get(linkData.source);
                const targetAnchor = $anchorsStore.get(linkData.target);
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
                        targetPositionMap.set(linkData.target, linkData.value + targetPositionMap.get(linkData.target));
                    } else {
                        targetPositionMap.set(linkData.target, linkData.value);
                    }
                    if (sourcePositionMap.has(linkData.source)) {
                        sourcePositionMap.set(linkData.source, linkData.value + sourcePositionMap.get(linkData.source));
                    } else {
                        sourcePositionMap.set(linkData.source, linkData.value);
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
