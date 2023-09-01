import type { SankeyLink } from "../types";
import { writable } from "svelte/store";

export type LinksStore = Map<string, SankeyLink>;

const createLinksStore = () => {
    const { subscribe, update } = writable<LinksStore>(new Map());
    return {
        subscribe,
        add: (newLink: SankeyLink) =>
            update((currentLinks) =>
                currentLinks.set(`${newLink.source}/${newLink.target}`, {
                    source: newLink.source,
                    target: newLink.target,
                    value: newLink.value <= 0 ? 0 : newLink.value
                })
            ),
        remove: (link: SankeyLink) =>
            update((currentLinks) => {
                currentLinks.delete(`${link.source}/${link.target}`);
                return currentLinks;
            })
    };
};

export const linksStore = createLinksStore();
