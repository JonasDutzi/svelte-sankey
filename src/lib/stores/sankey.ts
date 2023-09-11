import { writable } from "svelte/store";

export type SankeyStore = {
    minPathHeight?: number;
    maxPathHeight?: number;
    minValue?: number;
    maxValue?: number;
    isLoading: boolean;
    highlightPaths?: boolean;
};

export const sankeyStore = writable<SankeyStore>({
    minPathHeight: 1,
    maxPathHeight: null,
    minValue: null,
    maxValue: null,
    isLoading: true,
    highlightPaths: true
});
