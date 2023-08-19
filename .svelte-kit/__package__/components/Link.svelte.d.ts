import { SvelteComponentTyped } from "svelte";
import type { SankeyLink } from "../types";
declare const __propDef: {
    props: {
        data: SankeyLink;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type LinkProps = typeof __propDef.props;
export type LinkEvents = typeof __propDef.events;
export type LinkSlots = typeof __propDef.slots;
export default class Link extends SvelteComponentTyped<LinkProps, LinkEvents, LinkSlots> {
}
export {};
