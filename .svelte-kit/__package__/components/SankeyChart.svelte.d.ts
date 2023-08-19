import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        showheaders: any;
        maxboxheight: any;
        chartdata: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SankeyChartProps = typeof __propDef.props;
export type SankeyChartEvents = typeof __propDef.events;
export type SankeyChartSlots = typeof __propDef.slots;
export default class SankeyChart extends SvelteComponentTyped<SankeyChartProps, SankeyChartEvents, SankeyChartSlots> {
}
export {};
