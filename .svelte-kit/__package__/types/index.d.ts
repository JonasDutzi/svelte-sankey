type SankeyData = {
    data: Array<SankeyColumn>;
    links: Array<SankeyLink>;
};
type SankeyColumn = {
    id: SankeyKey;
    columnLabel?: string;
    rows: Array<SankeyRow>;
};
type SankeyRow = {
    rowLabel?: string;
    items: Array<SankeyItem>;
};
type SankeyItem = {
    id: SankeyKey;
    label: string;
};
type SankeyLink = {
    source: SankeyKey;
    target: SankeyKey;
    value: number;
};
type SankeyKey = string | number;
export declare enum Axis {
    x = "x",
    y = "y"
}
export type { SankeyData, SankeyColumn, SankeyItem, SankeyKey, SankeyLink, SankeyRow };
