import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        showHeaders?: boolean;
        maxBoxHeight?: number;
        minPathWidth?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type SankeyProps = typeof __propDef.props;
export type SankeyEvents = typeof __propDef.events;
export type SankeySlots = typeof __propDef.slots;
export default class Sankey extends SvelteComponentTyped<SankeyProps, SankeyEvents, SankeySlots> {
}
export {};
