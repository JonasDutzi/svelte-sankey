import type { SankeyKey } from "../types";
import { writable } from "svelte/store";

export type Link = {
    source: SankeyKey;
    target: SankeyKey;
    value: number;
    strokeColor?: string;
    strokeColorHover?: string;
};

export type LinksStore = Map<string, Link>;

const createLinksStore = () => {
    const { subscribe, update } = writable<LinksStore>(new Map());
    return {
        subscribe,
        add: (newLink: Link) =>
            update((currentLinks) =>
                currentLinks.set(`${newLink.source}/${newLink.target}`, {
                    source: newLink.source,
                    target: newLink.target,
                    value: newLink.value <= 0 ? 0 : newLink.value,
                    strokeColor: newLink.strokeColor,
                    strokeColorHover: newLink.strokeColorHover
                })
            ),
        remove: (link: Link) =>
            update((currentLinks) => {
                currentLinks.delete(`${link.source}/${link.target}`);
                return currentLinks;
            })
    };
};

export const linksStore = createLinksStore();
