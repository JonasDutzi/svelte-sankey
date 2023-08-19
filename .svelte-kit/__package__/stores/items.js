import { derived } from "svelte/store";
import { dataStore, linksStore } from "./index";
import { logError } from "../helper";
const createItemsStore = () => {
    const { subscribe } = derived([dataStore, linksStore], ([$dataStore, $linksStore]) => {
        const items = new Map();
        if ($dataStore?.size > 0) {
            for (const [columnKey, columnData] of $dataStore.entries()) {
                for (const row of columnData.rows) {
                    for (const item of row.items) {
                        const sources = [];
                        const targets = [];
                        for (const link of $linksStore.values()) {
                            if (link.source === item.id) {
                                targets.push({ id: link.target, value: link.value });
                            }
                            if (link.target === item.id) {
                                sources.push({ id: link.source, value: link.value });
                            }
                        }
                        if (items.has(item.id)) {
                            logError(`Sankey Item id must be unique. Item with id "${item.id}" already exists.`);
                        }
                        else {
                            items.set(item.id, {
                                id: item.id,
                                label: item.label,
                                columnKey,
                                sources,
                                targets,
                                sourcesTotalValue: getEdgeTotalValue(sources),
                                targetsTotalValue: getEdgeTotalValue(targets)
                            });
                        }
                    }
                }
            }
        }
        return items;
    });
    return {
        subscribe
    };
};
const getEdgeTotalValue = (edges) => {
    if (edges.length > 0) {
        return sumUpItemValues(edges);
    }
    return 0;
};
const sumUpItemValues = (edges) => {
    const sum = edges.reduce((sumValue, edge) => {
        sumValue += edge.value;
        return sumValue;
    }, 0);
    return sum;
};
export const itemsStore = createItemsStore();
