/// <reference types="svelte" />
import type { SankeyKey } from "../types";
export type SankeyItem = {
    id: SankeyKey;
    label: string;
    columnKey: SankeyKey;
    sources?: Array<SankeyEdge>;
    targets?: Array<SankeyEdge>;
    sourcesTotalValue: number;
    targetsTotalValue: number;
};
export type SankeyEdge = {
    id: SankeyKey;
    value: number;
};
export type ItemsStore = Map<string, SankeyItem>;
export declare const itemsStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Map<SankeyKey, SankeyItem>>, invalidate?: import("svelte/store").Invalidator<Map<SankeyKey, SankeyItem>>) => import("svelte/store").Unsubscriber;
};
