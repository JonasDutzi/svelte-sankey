import { writable } from 'svelte/store';
const createAnchorsStore = () => {
    const { subscribe, update } = writable(new Map());
    return {
        subscribe,
        setAnchor: (anchor) => update((currentAnchors) => {
            const { id, ...data } = anchor;
            return currentAnchors.set(id, data);
        }),
        remove: (anchorId) => update((currentAnchors) => {
            currentAnchors.delete(anchorId);
            return currentAnchors;
        })
    };
};
export const anchorsStore = createAnchorsStore();
