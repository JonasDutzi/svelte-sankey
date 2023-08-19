import { derived } from "svelte/store";
import { anchorsStore, linksStore } from "../stores/index";
const createPathsStore = () => {
    const { subscribe } = derived([anchorsStore, linksStore], ([$anchorsStore, $linksStore]) => {
        const paths = new Map();
        if ($linksStore?.size > 0) {
            const targetPositionMap = new Map();
            const sourcePositionMap = new Map();
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
                    }
                    else {
                        targetPositionMap.set(linkData.target, linkData.value);
                    }
                    if (sourcePositionMap.has(linkData.source)) {
                        sourcePositionMap.set(linkData.source, linkData.value + sourcePositionMap.get(linkData.source));
                    }
                    else {
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
