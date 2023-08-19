import { writable } from "svelte/store";
const createLinksStore = () => {
    const { subscribe, update } = writable(new Map());
    return {
        subscribe,
        add: (newLink) => update((currentLinks) => currentLinks.set(`${newLink.source}/${newLink.target}`, {
            source: newLink.source,
            target: newLink.target,
            value: newLink.value <= 0 ? 1 : newLink.value
        })),
        remove: (link) => update((currentLinks) => {
            currentLinks.delete(`${link.source}/${link.target}`);
            return currentLinks;
        })
    };
};
export const linksStore = createLinksStore();
