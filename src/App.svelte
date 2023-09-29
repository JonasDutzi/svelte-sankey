<script lang="ts">
    import "./index.css";
    import { sankeyData } from "./testdata/data.customdata.ts";
    import { sankeyData as sankeyData2 } from "./testdata/data.ts";
    import SankeyInspector from "./inspector/Inspector.svelte";
    import SankeyChart from "./lib/components/SankeyChart.svelte";
    import CustomSankey from "./lib/components/CustomSankey.svelte";

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
    let size = 3;
</script>

<main>
    <!-- <SankeyChart
        highlightpaths={highlightPaths}
        showheaders={showHeaders}
        maxpathheight={size}
        chartdata={sankeyData}
        on:itemclick={onItemClicked}
        on:anchormouseenter={onAnchorMouseEnter}
        on:anchormouseleave={onAnchorMouseLeave}
    /> -->
    <CustomSankey showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={sankeyData} />
    <SankeyInspector bind:highlightPaths bind:showHeaders bind:size showStores={true} />
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
