import { SvelteComponentTyped } from "svelte";
import type { SankeyColumn } from "../../types";
declare const __propDef: {
    props: {
        data: SankeyColumn;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ColumnContentProps = typeof __propDef.props;
export type ColumnContentEvents = typeof __propDef.events;
export type ColumnContentSlots = typeof __propDef.slots;
export default class ColumnContent extends SvelteComponentTyped<ColumnContentProps, ColumnContentEvents, ColumnContentSlots> {
}
export {};
