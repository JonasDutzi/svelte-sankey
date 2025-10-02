import type { SankeyColumn, SankeyKey } from "../types";

type Data = Record<SankeyKey, SankeyColumn>;

class DataStore {
	data = $state<Data>({});

	addColumn(column: SankeyColumn) {
		this.data[column.id] = column;
	}

	removeColumn(column: SankeyColumn) {
		delete this.data[column.id];
	}
}

export const dataStore = new DataStore();
