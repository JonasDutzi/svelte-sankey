import { SvelteComponentTyped } from "svelte";
import type { Path } from "../../stores/paths";
declare const __propDef: {
    props: {
        key: string;
        data: Path;
        minPathWidth?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SankeyLineProps = typeof __propDef.props;
export type SankeyLineEvents = typeof __propDef.events;
export type SankeyLineSlots = typeof __propDef.slots;
export default class SankeyLine extends SvelteComponentTyped<SankeyLineProps, SankeyLineEvents, SankeyLineSlots> {
}
export {};
