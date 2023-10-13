import type { SankeyKey } from "../types";
import { writable } from "svelte/store";

export type Link = {
    source: SankeyKey;
    target: SankeyKey;
    value: number;
    strokeColor?: string;
    strokeColorHover?: string;
};

export type LinksStore = Map<string, LinkData>;
type LinkData = Map<string, Link>;

const createLinksStore = () => {
    const { subscribe, update } = writable<LinksStore>(new Map());
    return {
        subscribe,
        add: (sankeyId: string, newLink: Link) =>
            update((currentData) => {
                if (currentData.has(sankeyId)) {
                    currentData.get(sankeyId).set(`${newLink.source}/${newLink.target}`, {
                        source: newLink.source,
                        target: newLink.target,
                        value: newLink.value <= 0 ? 0 : newLink.value,
                        strokeColor: newLink.strokeColor,
                        strokeColorHover: newLink.strokeColorHover
                    });
                } else {
                    const data = new Map<string, Link>();
                    data.set(`${newLink.source}/${newLink.target}`, newLink);
                    currentData.set(sankeyId, data);
                }
                return currentData;
                // currentLinks.set(`${newLink.source}/${newLink.target}`, {
                //     source: newLink.source,
                //     target: newLink.target,
                //     value: newLink.value <= 0 ? 0 : newLink.value,
                //     strokeColor: newLink.strokeColor,
                //     strokeColorHover: newLink.strokeColorHover
                // })
            }),
        remove: (sankeyId: string, link: Link) =>
            update((currentData) => {
                currentData.get(sankeyId).delete(`${link.source}/${link.target}`);
                return currentData;
            })
    };
};

export const linksStore = createLinksStore();
