import { SvelteComponentTyped } from "svelte";
import type { SankeyKey } from "../../types";
declare const __propDef: {
    props: {
        id: SankeyKey;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type AnchorProps = typeof __propDef.props;
export type AnchorEvents = typeof __propDef.events;
export type AnchorSlots = typeof __propDef.slots;
export default class Anchor extends SvelteComponentTyped<AnchorProps, AnchorEvents, AnchorSlots> {
}
export {};
