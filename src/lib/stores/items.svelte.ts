import type { SankeyKey } from "../types/index.ts";
import { logError } from "../helper.ts";
import { dataStore } from "./data.svelte.ts";
import { linksStore } from "./links.svelte.ts";

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

export type ItemsStore = Record<string, SankeyItem>;

const createItemsStore = () => {
  const getItems = () => {
    const items: ItemsStore = {};
    if (
      Object.keys(dataStore.value).length > 0 &&
      Object.keys(linksStore.value).length > 0
      // &&
      // Object.keys(anchorsStore.value).length === Object.keys(linksStore.value).length
    ) {
      for (const [columnKey, columnData] of Object.entries(dataStore.value)) {
        for (const row of columnData.rows) {
          for (const item of row.items) {
            const sources: Array<SankeyEdge> = [];
            const targets: Array<SankeyEdge> = [];
            for (const [, link] of Object.entries(linksStore.value)) {
              if (link.source === item.id) {
                targets.push({ id: link.target, value: link.value });
              }
              if (link.target === item.id) {
                sources.push({ id: link.source, value: link.value });
              }
            }
            if (items[item.id]) {
              logError(
                `Sankey Item id must be unique. Item with id "${item.id}" already exists.`
              );
            } else {
              items[item.id] = {
                id: item.id,
                label: item.label,
                columnKey,
                sources,
                targets,
                totalValues: {
                  sources: getEdgeTotalValue(sources),
                  targets: getEdgeTotalValue(targets),
                },
              };
            }
          }
        }
      }
    }
    return items;
  };

  const items = $derived(getItems());
  return {
    get value() {
      return items;
    },
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
