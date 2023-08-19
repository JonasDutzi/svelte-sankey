/// <reference types="svelte" />
import type { SankeyColumn, SankeyKey } from "../types";
type DataStore = Map<SankeyKey, SankeyColumn>;
export declare const dataStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<DataStore>, invalidate?: import("svelte/store").Invalidator<DataStore>) => import("svelte/store").Unsubscriber;
    addColumn: (column: SankeyColumn) => void;
    removeColumn: (column: SankeyColumn) => void;
};
export {};
