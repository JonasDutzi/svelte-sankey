<script lang="ts">
    import { sankeyData } from "./testdata/data_new.ts";
    import { sankeyData as sankeyData2 } from "./testdata/data.ts";
    import SankeyInspector from "./inspector/Inspector.svelte";
    import SankeyChart from "./lib/components/SankeyChart.svelte";

    const onItemClicked = (e) => {
        console.log(e.detail.item);
    };

    const onAnchorMouseEnter = (e) => {
        console.log(e.detail.item);
    };

    const onAnchorMouseLeave = (e) => {
        console.log(e.detail.item);
    };

    let highlightPaths;
    let showHeaders;
    let size;
</script>

<main>
    <!-- <SankeyChart chartdata={sankeyData} showheaders={true} maxpathheight={40} /> -->
    <!-- <SankeyChart showheaders={showHeaders} maxpathheight={size} chartdata={sankeyData} on:itemclick={onItemClicked} /> -->
    <SankeyChart
        highlightpaths={highlightPaths}
        showheaders={showHeaders}
        maxpathheight={size}
        chartdata={sankeyData}
        on:itemclick={onItemClicked}
        on:anchormouseenter={onAnchorMouseEnter}
        on:anchormouseleave={onAnchorMouseLeave}
    />
    <SankeyInspector bind:highlightPaths bind:showHeaders bind:size />
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
