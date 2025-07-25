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

export type AnchorsStore = Record<SankeyKey, Anchor>;

const createAnchorsStore = () => {
	const anchorsStore = $state<AnchorsStore>({});

	const setAnchor = (anchor: NewAnchor) => {
		const { id, ...data } = anchor;
		anchorsStore[id] = data;
	};

	const remove = (anchorId: SankeyKey) => {
		delete anchorsStore[anchorId];
	};

	return {
		get value() {
			return anchorsStore;
		},
		setAnchor,
		remove
	};
};

export const anchorsStore = createAnchorsStore();
