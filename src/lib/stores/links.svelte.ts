import type { SankeyKey } from "../types";

export type Link = {
	source: SankeyKey;
	target: SankeyKey;
	value: number;
	strokeColor?: string;
	strokeColorHover?: string;
};

export type LinksStore = Record<string, Link>;

const createLinksStore = () => {
	const linksStore = $state<LinksStore>({});

	const add = (newLink: Link) => {
		linksStore[`${newLink.source}/${newLink.target}`] = {
			source: newLink.source,
			target: newLink.target,
			value: newLink.value <= 0 ? 0 : newLink.value,
			strokeColor: newLink.strokeColor,
			strokeColorHover: newLink.strokeColorHover
		};
	};

	const remove = (link: Link) => {
		delete linksStore[`${link.source}/${link.target}`];
	};

	return {
		get value() {
			return linksStore;
		},
		add,
		remove
	};
};

export const linksStore = createLinksStore();
