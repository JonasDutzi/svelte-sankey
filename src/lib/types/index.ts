import type { SankeyItem as ItemDataStore } from "../stores/items";

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
    data?: Record<any, any>;
};

type ItemData = ItemDataStore & { value: number };

type SankeyLink = {
    target: SankeyKey;
    value: number;
};

type SankeyKey = string | number;

export enum Axis {
    x = "x",
    y = "y"
}

export type { SankeyData, SankeyColumn, SankeyItem, ItemData, SankeyKey, SankeyLink, SankeyRow };
