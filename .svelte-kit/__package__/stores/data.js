import { writable } from "svelte/store";
import { logError } from "../helper";
const createDataStore = () => {
    const { subscribe, update } = writable(new Map());
    return {
        subscribe,
        addColumn: (column) => update((currentColumns) => {
            if (currentColumns.has(column.id)) {
                logError(`Sankey Column id must be unique. Column with id "${column.id}" already exists.`);
                return currentColumns;
            }
            else {
                return currentColumns.set(column.id, column);
            }
        }),
        removeColumn: (column) => update((currentColumns) => {
            currentColumns.delete(column.id);
            return currentColumns;
        })
    };
};
export const dataStore = createDataStore();
