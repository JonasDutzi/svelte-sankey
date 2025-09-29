import type { SankeyKey } from "../types";

export type Anchor = {
	positionX: number;
	positionY: number;
	anchorColor?: string;
};

export type NewAnchor = {
	id: SankeyKey;
	positionX: number;
	positionY: number;
	anchorColor?: string;
};

export type Anchors = Record<SankeyKey, Anchor>;

class AnchorsStore {
	data = $state<Anchors>({});

	get value() {
		return this.data;
	}

	add(anchor: NewAnchor) {
		const { id, ...data } = anchor;
		this.data[id] = data;
	}
}

export const anchorsStore = new AnchorsStore();
