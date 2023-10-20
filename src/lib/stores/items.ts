import { derived } from "svelte/store";
import type { SankeyKey } from "../types";
import { logError } from "../helper";
import { dataStore } from "./data";
import { linksStore } from "./links";

export type SankeyItem = {
    id: SankeyKey;
    label: string;
    columnKey: SankeyKey;
    sources?: Array<SankeyEdge>;
    targets?: Array<SankeyEdge>;
    totalValues: TotalValues;
};

export type TotalValues = {
    sources: number;
    targets: number;
};

export type SankeyEdge = {
    id: SankeyKey;
    value: number;
};

export type ItemsStore = Map<string, Map<SankeyKey, SankeyItem>>;

const createItemsStore = () => {
    const { subscribe } = derived([dataStore, linksStore], ([$dataStore, $linksStore]) => {
        const itemsData = new Map<string, Map<SankeyKey, SankeyItem>>();
        if ($dataStore?.size > 0) {
            for (const [sankeyId, sankeyData] of $dataStore.entries()) {
                for (const [columnKey, columnData] of sankeyData.entries()) {
                    for (const row of columnData.rows) {
                        for (const item of row.items) {
                            const sources: Array<SankeyEdge> = [];
                            const targets: Array<SankeyEdge> = [];
                            for (const link of $linksStore.get(sankeyId).values()) {
                                if (link.source === item.id) {
                                    targets.push({ id: link.target, value: link.value });
                                }
                                if (link.target === item.id) {
                                    sources.push({ id: link.source, value: link.value });
                                }
                            }
                            if (itemsData.has(sankeyId) && itemsData.get(sankeyId).get(item.id)) {
                                logError(`Sankey Item id must be unique. Item with id "${item.id}" already exists.`);
                                continue;
                            }
                            if (itemsData.has(sankeyId)) {
                                itemsData.get(sankeyId).set(item.id, {
                                    id: item.id,
                                    label: item.label,
                                    columnKey,
                                    sources,
                                    targets,
                                    totalValues: {
                                        sources: getEdgeTotalValue(sources),
                                        targets: getEdgeTotalValue(targets)
                                    }
                                });
                            } else {
                                const data = new Map<SankeyKey, SankeyItem>();
                                data.set(item.id, {
                                    id: item.id,
                                    label: item.label,
                                    columnKey,
                                    sources,
                                    targets,
                                    totalValues: {
                                        sources: getEdgeTotalValue(sources),
                                        targets: getEdgeTotalValue(targets)
                                    }
                                });
                                itemsData.set(sankeyId, data);
                            }
                        }
                    }
                }
            }
        }
        return itemsData;
    });

    return {
        subscribe
    };
};

const getEdgeTotalValue = (edges: Array<SankeyEdge>): number => {
    if (edges.length > 0) {
        return sumUpItemValues(edges);
    }
    return 0;
};

const sumUpItemValues = (edges: Array<SankeyEdge>) => {
    const sum = edges.reduce((sumValue, edge) => {
        sumValue += edge.value;
        return sumValue;
    }, 0);
    return sum;
};

export const itemsStore = createItemsStore();
