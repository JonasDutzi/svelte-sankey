import { writable } from "svelte/store";

export type WrapperStore = Map<string, SankeyWrapper>;

export type SankeyWrapper = {
    height: number;
    width: number;
    top: number;
    left: number;
};

const createWrapperStore = () => {
    const { subscribe, update } = writable<WrapperStore>(new Map());
    return {
        subscribe,
        create: (sankeyId: string) =>
            update((currentWrappers) =>
                currentWrappers.set(sankeyId, {
                    height: 0,
                    width: 0,
                    top: 0,
                    left: 0
                })
            )
    };
};

export const wrapperStore = createWrapperStore();
