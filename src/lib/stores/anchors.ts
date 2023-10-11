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
export type AnchorsStore = Map<string, Map<SankeyKey, Anchor>>;

const createAnchorsStore = () => {
    const { subscribe, update } = writable<AnchorsStore>(new Map());
    return {
        subscribe,
        add: (anchor: NewAnchor, sankeyId: string) =>
            update((currentAnchorStores) => {
                const { id, ...data } = anchor;
                return currentAnchorStores.get(sankeyId).set(id, data);
            }),
        remove: (anchorId: SankeyKey, sankeyId: string) =>
            update((currentAnchorStores) => {
                currentAnchorStores.get(sankeyId).delete(anchorId);
                return currentAnchorStores;
            })
    };
};

export const anchorsStore = createAnchorsStore();
