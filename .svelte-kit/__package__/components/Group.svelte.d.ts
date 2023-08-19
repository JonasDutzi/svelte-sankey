/** @typedef {typeof __propDef.props}  GroupProps */
/** @typedef {typeof __propDef.events}  GroupEvents */
/** @typedef {typeof __propDef.slots}  GroupSlots */
export default class Group extends SvelteComponentTyped<{
    [x: string]: never;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    header: {};
    default: {};
}> {
}
export type GroupProps = typeof __propDef.props;
export type GroupEvents = typeof __propDef.events;
export type GroupSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: never;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        header: {};
        default: {};
    };
};
export {};
