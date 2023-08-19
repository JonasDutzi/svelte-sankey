/// <reference types="svelte" />
import type { SankeyLink } from "$types";
export type LinksStore = Map<string, SankeyLink>;
export declare const linksStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<LinksStore>, invalidate?: import("svelte/store").Invalidator<LinksStore>) => import("svelte/store").Unsubscriber;
    add: (newLink: SankeyLink) => void;
    remove: (link: SankeyLink) => void;
};
