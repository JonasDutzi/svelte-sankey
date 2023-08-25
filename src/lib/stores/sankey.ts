import { writable } from "svelte/store";

export type SankeyStore = {
    maxBoxHeight: number;
    minPathWidth: number;
    isLoading: boolean;
};

export const sankeyStore = writable<SankeyStore>({
    maxBoxHeight: 30,
    minPathWidth: 1,
    isLoading: true
});
