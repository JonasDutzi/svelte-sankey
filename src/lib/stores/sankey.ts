import { writable } from "svelte/store";

export type SankeyStore = Map<string, SankeyDiagram>;

export type SankeyDiagram = {
    minPathHeight?: number;
    maxPathHeight?: number;
    minValue?: number;
    maxValue?: number;
    isLoading: boolean;
    highlightPaths?: boolean;
};

const createSankeyStore = () => {
    const { subscribe, update } = writable<SankeyStore>(new Map());
    return {
        subscribe,
        create: (sankeyId: string) =>
            update((currentSankeys) =>
                currentSankeys.set(sankeyId, {
                    minPathHeight: 1,
                    maxPathHeight: null,
                    minValue: null,
                    maxValue: null,
                    isLoading: true,
                    highlightPaths: true
                })
            )
    };
};

export const sankeyStore = createSankeyStore();
