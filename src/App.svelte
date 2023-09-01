<script lang="ts">
    import { sankeyData } from "./testdata/data.bigger.ts";
    import { sankeyData as sankeyData2 } from "./testdata/data.ts";
    import { ColumnContent, ColumnHeader, Item, Link, Sankey } from "./lib/index";
    import SankeyInspector from "./lib/components/SankeyInspector.svelte";
    import SankeyChart from "./lib/components/SankeyChart.svelte";
</script>

<main>
    <h1 style="margin-block: 4rem;">Svelte Sankey</h1>
    <!-- <SankeyChart chartdata={sankeyData} showheaders={true} maxpathheight={40} /> -->
    <SankeyChart showheaders={true} maxpathheight={40} chartdata={sankeyData2} />
    <!-- <SankeyInspector /> -->
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
