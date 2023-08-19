import { SvelteComponentTyped } from "svelte";
import type { SankeyItem } from "../types";
declare const __propDef: {
    props: {
        item: SankeyItem;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ItemProps = typeof __propDef.props;
export type ItemEvents = typeof __propDef.events;
export type ItemSlots = typeof __propDef.slots;
export default class Item extends SvelteComponentTyped<ItemProps, ItemEvents, ItemSlots> {
}
export {};
