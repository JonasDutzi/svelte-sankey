import { logError } from "../helper";
import type { SankeyKey } from "../types";
import { writable } from "svelte/store";

export type Anchor = {
    positionX: number;
    positionY: number;
};

export type NewAnchor = {
    id: SankeyKey;
    positionX: number;
    positionY: number;
};
export type AnchorStore = Map<string, OneAnchor>;
export type OneAnchor = Map<SankeyKey, Anchor>;

const createAnchorsStore = () => {
    const { subscribe, update } = writable<AnchorStore>(new Map());
    return {
        subscribe,
        add: (sankeyId: string, anchor: NewAnchor) =>
            update((currentData) => {
                const { id, ...data } = anchor;
                if (currentData.has(sankeyId)) {
                    let currentAnchors = currentData.get(sankeyId);
                    if (currentAnchors.has(id)) {
                        logError(`Sankey Anchor id must be unique. Anchor with id "${id}" already exists.`);
                    } else {
                        currentAnchors.set(id, data);
                    }
                } else {
                    const anchorsData = new Map<SankeyKey, NewAnchor>();
                    anchorsData.set(id, anchor);
                    currentData.set(sankeyId, anchorsData);
                }
                return currentData;
            }),
        remove: (sankeyId: string, anchorId: SankeyKey) =>
            update((currentData) => {
                currentData.get(sankeyId).delete(anchorId);
                return currentData;
            })
    };
};

export const anchorsStore = createAnchorsStore();
