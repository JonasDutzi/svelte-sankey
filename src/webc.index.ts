//export * from "../src/lib/components/index";
export default () => {
    import("./lib/components/Sankey.svelte");
    import("./lib/components/SankeyChart.svelte");
    import("./lib/components/Label.svelte");
};
