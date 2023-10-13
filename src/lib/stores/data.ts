import { writable } from "svelte/store";
import type { SankeyColumn, SankeyKey } from "../types";
import { logError } from "../helper";

type DataStore = Map<string, Data>;
type Data = Map<SankeyKey, SankeyColumn>;

const createDataStore = () => {
    const { subscribe, update } = writable<DataStore>(new Map());
    return {
        subscribe,
        addColumn: (sankeyId: string, column: SankeyColumn) =>
            update((currentData) => {
                if (currentData.has(sankeyId)) {
                    let currentColumns = currentData.get(sankeyId);
                    if (currentColumns.has(column.id)) {
                        logError(`Sankey Column id must be unique. Column with id "${column.id}" already exists.`);
                    } else {
                        currentColumns.set(column.id, column);
                    }
                } else {
                    const data = new Map<SankeyKey, SankeyColumn>();
                    data.set(column.id, column);
                    currentData.set(sankeyId, data);
                }
                return currentData;
            }),
        removeColumn: (sankeyId: string, column: SankeyColumn) =>
            update((currentData) => {
                currentData.get(sankeyId).delete(column.id);
                return currentData;
            })
    };
};

export const dataStore = createDataStore();
