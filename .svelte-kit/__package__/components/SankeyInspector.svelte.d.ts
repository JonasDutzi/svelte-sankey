import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SankeyInspectorProps = typeof __propDef.props;
export type SankeyInspectorEvents = typeof __propDef.events;
export type SankeyInspectorSlots = typeof __propDef.slots;
export default class SankeyInspector extends SvelteComponentTyped<SankeyInspectorProps, SankeyInspectorEvents, SankeyInspectorSlots> {
}
export {};
