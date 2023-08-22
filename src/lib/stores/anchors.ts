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

export type AnchorsStore = Map<SankeyKey, Anchor>;

const createAnchorsStore = () => {
    const { subscribe, update } = writable<AnchorsStore>(new Map());
    return {
        subscribe,
        setAnchor: (anchor: NewAnchor) =>
            update((currentAnchors) => {
                const { id, ...data } = anchor;
                return currentAnchors.set(id, data);
            }),
        remove: (anchorId: SankeyKey) =>
            update((currentAnchors) => {
                currentAnchors.delete(anchorId);
                return currentAnchors;
            })
    };
};

export const anchorsStore = createAnchorsStore();
