import type { SankeyKey } from "../types";

export type Link = {
	source: SankeyKey;
	target: SankeyKey;
	value: number;
	strokeColor?: string;
	strokeColorHover?: string;
	ariaLabel?: string;
};

export type Links = Record<string, Link>;

class LinksStore {
	data = $state<Links>({});

	add(newLink: Link) {
		this.data[`${newLink.source}/${newLink.target}`] = {
			source: newLink.source,
			target: newLink.target,
			value: newLink.value <= 0 ? 0 : newLink.value,
			strokeColor: newLink.strokeColor,
			strokeColorHover: newLink.strokeColorHover,
			ariaLabel: newLink.ariaLabel
		};
	}

	remove(link: Link) {
		delete this.data[`${link.source}/${link.target}`];
	}
}

export const linksStore = new LinksStore();
