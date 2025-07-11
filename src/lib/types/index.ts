import type { SankeyItem as ItemDataStore } from "../stores/items.svelte";

export type {
	SankeyData,
	SankeyColumn,
	SankeyItem,
	ItemData,
	SankeyKey,
	SankeyLink,
	SankeyRow,
	OnItemClick,
	OnAnchorClick,
	OnAnchorMouseEnter,
	OnAnchorMouseLeave,
	OnPathClick,
	OnPathMouseEnter,
	OnPathMouseLeave
};

type SankeyData = {
	data: Array<SankeyColumn>;
	//links: Array<SankeyLink>;
};

type SankeyColumn = {
	id: SankeyKey;
	rows: Array<SankeyRow>;
	columnLabel?: string;
	data?: Record<any, any>;
};

type SankeyRow = {
	items: Array<SankeyItem>;
	rowLabel?: string;
	data?: Record<any, any>;
};

type SankeyItem = {
	id: SankeyKey;
	label: string;
	links?: Array<SankeyLink>;
	anchorColor?: string;
	data?: Record<any, any>;
};

type ItemData = ItemDataStore & { value: number };

type SankeyLink = {
	target: SankeyKey;
	value: number;
	strokeColor?: string;
	strokeColorHover?: string;
	data?: Record<any, any>;
};

type SankeyKey = string | number;

export enum Axis {
	x = "x",
	y = "y"
}

type OnItemClick = (item: SankeyItem) => void;
type OnAnchorMouseEnter = OnItemClick;
type OnAnchorMouseLeave = OnItemClick;
type OnAnchorClick = OnItemClick;

type OnPathClick = (data: { source: SankeyItem; target: SankeyItem }) => void;
type OnPathMouseEnter = OnPathClick;
type OnPathMouseLeave = OnPathClick;
