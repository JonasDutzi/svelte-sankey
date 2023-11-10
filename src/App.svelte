<script lang="ts">
    import "./index.css";
    import { sankeyData as customData } from "./testdata/data.customdata.ts";
    import { sankeyData as dataBigger } from "./testdata/data.bigger.ts";
    import { sankeyData as dataInconsistent } from "./testdata/data.inconsistent.ts";
    import SankeyCustomData from "./testdata/SankeyCustomData.svelte";
    import SankeyDataBigger from "./testdata/SankeyDataBigger.svelte";
    import SankeyInspector from "./inspector/Inspector.svelte";
    import SankeyChart from "./lib/components/SankeyChart.svelte";
    import type { SankeyColumn } from "./lib/index.ts";
    import { fade } from "svelte/transition";

    let chartData = [];

    $: {
        chartData = dataBigger.data;
    }

    const onItemClicked = (e) => {
        console.log(e.detail.item);
    };

    const onAnchorMouseEnter = (e) => {
        console.log(e.detail.item);
    };

    const onAnchorMouseLeave = (e) => {
        console.log(e.detail.item);
    };

    const addData = () => {
        const newColumn: SankeyColumn = {
            id: "new1",
            columnLabel: "New Column",
            rows: [
                {
                    rowLabel: "New Category",
                    items: [
                        {
                            id: "newData1",
                            label: "New data 1"
                        },
                        { id: "newData2", label: "New data 2" }
                    ]
                }
            ]
        };
        const newLinks = [
            {
                target: "newData1",
                value: 13
            },
            {
                target: "newData2",
                value: 14
            }
        ];
        chartData[2].rows[0].items[0].links = newLinks;
        chartData = chartData.concat(newColumn);
    };
    const addMoreData = () => {
        const newColumn: SankeyColumn = {
            id: "new2",
            columnLabel: "New Column 2",
            rows: [
                {
                    rowLabel: "New Category 2",
                    items: [
                        {
                            id: "newData3",
                            label: "New data 3"
                        },
                        { id: "newData4", label: "New data 4" }
                    ]
                }
            ]
        };
        const newLinks = [
            {
                target: "newData3",
                value: 3
            },
            {
                target: "newData4",
                value: 4
            }
        ];
        chartData[3].rows[0].items[0].links = newLinks;
        chartData = chartData.concat(newColumn);
    };

    const removeData = () => {
        chartData = dataBigger.data;
    };

    const addSomeEntries = async () => {
        animate(addData);
    };

    const addSomeMoreEntries = async () => {
        animate(addMoreData);
    };

    const removeSomeEntries = () => {
        animate(removeData);
    };

    const animate = (cb: () => void) => {
        if (!document || !(document as any).startViewTransition) {
            cb();
        } else {
            (document as any).startViewTransition(() => {
                cb();
            });
        }
    };

    let highlightPaths;
    let showHeaders;
    let size = 105;
</script>

<main>
    <div style="margin-block: 3rem;">
        <h3 style="margin-block: 1rem;">Actions</h3>
        <button on:click={addSomeEntries}>Add data</button>
        <button on:click={addSomeMoreEntries}>Add more data</button>
        <button on:click={removeSomeEntries}>Remove data</button>
    </div>
    {#if chartData}
        <SankeyChart
            highlightpaths={highlightPaths}
            showheaders={showHeaders}
            maxpathheight={size}
            chartdata={chartData}
            on:itemclick={onItemClicked}
            on:anchormouseenter={onAnchorMouseEnter}
            on:anchormouseleave={onAnchorMouseLeave}
        />
    {/if}

    <!-- <SankeyCustomData showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataBigger} /> -->
    <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataBigger} /> -->
    <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataInconsistent} /> -->
    <SankeyInspector bind:highlightPaths bind:showHeaders bind:size showStores={true} />
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
