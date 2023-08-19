/// <reference types="svelte" />
export type Path = {
    sourcePosition: Position;
    targetPosition: Position;
};
export type Position = {
    x: number | undefined;
    y: number | undefined;
};
export type PathsStore = Map<string, Path>;
export declare const pathsStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<Map<string, Path>>, invalidate?: import("svelte/store").Invalidator<Map<string, Path>>) => import("svelte/store").Unsubscriber;
};
