import type { SankeyColumn, SankeyKey } from "../types";

type DataStore = Record<SankeyKey, SankeyColumn>;

const createDataStore = () => {
  const dataStore = $state<DataStore>({});

  const addColumn = (column: SankeyColumn) => {
    dataStore[column.id] = column;
  };

  const removeColumn = (column: SankeyColumn) => {
    delete dataStore[column.id];
  };

  return {
    get value() {
      return dataStore;
    },
    addColumn,
    removeColumn,
  };
};

export const dataStore = createDataStore();
