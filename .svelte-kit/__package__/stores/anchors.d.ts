/// <reference types="svelte" />
import type { SankeyKey } from '$types';
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
export declare const anchorsStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<AnchorsStore>, invalidate?: import("svelte/store").Invalidator<AnchorsStore>) => import("svelte/store").Unsubscriber;
    setAnchor: (anchor: NewAnchor) => void;
    remove: (anchorId: SankeyKey) => void;
};
