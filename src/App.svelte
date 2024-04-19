<script lang="ts">
  import "./index.css";
  import { sankeyData } from "./testdata/data.customdata.ts";
  import { sankeyData as dataBigger } from "./testdata/data.bigger.ts";
  // import { sankeyData as dataInconsistent } from "./testdata/data.inconsistent.ts";
  import SankeyCustomData from "./testdata/SankeyCustomData.svelte";
  import SankeyDataBigger from "./testdata/SankeyDataBigger.svelte";
  import SankeyInspector from "./inspector/Inspector.svelte";
  import SankeyChart from "./lib/components/SankeyChart.svelte";

  const onItemClicked = (e: any) => {
    console.log(e.detail.item);
  };

  const onAnchorMouseEnter = (e: any) => {
    console.log(e.detail.item);
  };

  const onAnchorMouseLeave = (e: any) => {
    console.log(e.detail.item);
  };

  let highlightPaths = $state(true);
  let showHeaders = $state(true);
  let size = $state(25);
</script>

<main>
  <SankeyChart
    highlightpaths={highlightPaths}
    showheaders={showHeaders}
    maxpathheight={size}
    chartdata={sankeyData}
    on:itemclick={onItemClicked}
    on:anchormouseenter={onAnchorMouseEnter}
    on:anchormouseleave={onAnchorMouseLeave}
  />
  <!-- <SankeyCustomData showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={customData} /> -->
  <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataBigger} /> -->
  <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataInconsistent} /> -->
  <!-- <SankeyInspector
    bind:khighlightPaths
    bind:showHeaders
    bind:size
    showStores={true}
    showSettings={true}
  /> -->
  <SankeyInspector showStores={true} showSettings={true} />
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
</style>
