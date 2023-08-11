import { writable } from "svelte/store";
import type { SankeyColumn, SankeyKey } from "../types";
import { logError } from "../helper";

type DataStore = Map<SankeyKey, SankeyColumn>;

const createDataStore = () => {
    const { subscribe, update } = writable<DataStore>(new Map());
    return {
        subscribe,
        addColumn: (column: SankeyColumn) =>
            update((currentColumns) => {
                if (currentColumns.has(column.id)) {
                    logError(`Sankey Column id must be unique. Column with id "${column.id}" already exists.`);
                    return currentColumns;
                } else {
                    return currentColumns.set(column.id, column);
                }
            }),
        removeColumn: (column: SankeyColumn) =>
            update((currentColumns) => {
                currentColumns.delete(column.id);
                return currentColumns;
            })
    };
};

export const dataStore = createDataStore();
