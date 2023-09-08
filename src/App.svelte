<script lang="ts">
    import { sankeyData } from "./testdata/data.bigger.ts";
    import { sankeyData as sankeyData2 } from "./testdata/data.ts";
    import SankeyInspector from "./inspector/Inspector.svelte";
    import SankeyChart from "./lib/components/SankeyChart.svelte";

    const onItemClicked = (e) => {
        console.log(e.detail.item);
    };

    let size = 30;
    let showHeaders = true;
</script>

<main>
    <h1 style="margin-block: 2rem;">Svelte Sankey</h1>
    <h2 style="margin-bottom: 1rem;">Settings/Props:</h2>
    <div style="display: flex; align-items: center; gap: 2rem">
        <div>
            <div>Size (maxpathheight):</div>
            <input type="range" min="30" max="200" bind:value={size} />
        </div>
        <div>
            <div>Headers (showheaders):</div>
            <input type="checkbox" bind:checked={showHeaders} />
        </div>
        <div style="margin-bottom: 2rem;" />
    </div>
    <div style="margin-bottom: 3rem;">__________________________________________________</div>
    <!-- <SankeyChart chartdata={sankeyData} showheaders={true} maxpathheight={40} /> -->
    <!-- <SankeyChart showheaders={showHeaders} maxpathheight={size} chartdata={sankeyData} on:itemclick={onItemClicked} /> -->
    <SankeyChart showheaders={showHeaders} maxpathheight={size} chartdata={sankeyData2} on:itemclick={onItemClicked} />
    <div style="margin-top: 3rem;">__________________________________________________</div>
    <SankeyInspector />
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
