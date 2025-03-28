import type { SankeyColumn, SankeyKey } from "../types";
import { logError } from "../helper";

type DataStore = Record<SankeyKey, SankeyColumn>;

const createDataStore = () => {
    let dataStore = $state<DataStore>({});

    const addColumn = (column: SankeyColumn) => {
        // if (dataStore[column.id]) {
        //     logError(`Sankey Column id must be unique. Column with id "${column.id}" already exists.`);
        // } else {
        dataStore[column.id] = column;
        // }
    };

    const removeColumn = (column: SankeyColumn) => {
        delete dataStore[column.id];
    };

    return {
        get value() {
            return dataStore;
        },
        addColumn,
        removeColumn
    };
};

export const dataStore = createDataStore();
