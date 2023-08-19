/** @typedef {typeof __propDef.props}  ColumnProps */
/** @typedef {typeof __propDef.events}  ColumnEvents */
/** @typedef {typeof __propDef.slots}  ColumnSlots */
export default class Column extends SvelteComponentTyped<{
    [x: string]: never;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    label: {};
    default: {};
}> {
}
export type ColumnProps = typeof __propDef.props;
export type ColumnEvents = typeof __propDef.events;
export type ColumnSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: never;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        label: {};
        default: {};
    };
};
export {};
