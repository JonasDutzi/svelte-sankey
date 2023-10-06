<script lang="ts">
    import "./index.css";
    import { sankeyData as customData } from "./testdata/data.customdata.ts";
    import { sankeyData as dataBigger } from "./testdata/data.bigger.ts";
    import { sankeyData as dataInconsistent } from "./testdata/data.inconsistent.ts";
    import SankeyCustomData from "./testdata/SankeyCustomData.svelte";
    import SankeyDataBigger from "./testdata/SankeyDataBigger.svelte";
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
    let size = 105;
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
    <!-- <SankeyCustomData showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={customData} /> -->
    <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataBigger} /> -->
    <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataInconsistent} />
    <SankeyInspector bind:highlightPaths bind:showHeaders bind:size showStores={false} />
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
