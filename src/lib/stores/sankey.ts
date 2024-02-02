import { writable } from "svelte/store";

export type SankeyStore = {
    maxPathHeight?: number;
    minValue?: number;
    maxValue?: number;
    isLoading: boolean;
    highlightPaths?: boolean;
};

export const sankeyStore = writable<SankeyStore>({
    maxPathHeight: null,
    minValue: null,
    maxValue: null,
    isLoading: true,
    highlightPaths: true
});
