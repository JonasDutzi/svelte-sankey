/// <reference types="svelte" />
export type WrapperStore = {
    height: number;
    width: number;
    top: number;
    left: number;
};
export declare const wrapperStore: import("svelte/store").Writable<WrapperStore>;
