<script lang="ts">
  import "./index.css";
  import { sankeyData as data } from "./testdata/data.customdata.ts";
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
    //console.log(e.detail.item);
  };

  const onAnchorMouseLeave = (e: any) => {
    //console.log(e.detail.item);
  };

  //basic example of resizing based on window breakpoints
  $effect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1025) {
        return; //use default size
      } else if (window.innerWidth > 768) {
        size = 150;
      } else {
        size = 60;
      }
    });
  });

  let highlightPaths = $state(true);
  let showHeaders = $state(true);
  let size = $state(280);
</script>

<main>
  <SankeyChart
    highlightpaths={highlightPaths}
    showheaders={showHeaders}
    maxpathheight={size}
    chartdata={data}
    on:itemclick={onItemClicked}
    on:anchormouseenter={onAnchorMouseEnter}
    on:anchormouseleave={onAnchorMouseLeave}
  />
  <!-- <SankeyCustomData showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={customData} /> -->
  <!-- <SankeyDataBigger
    showheaders={showHeaders}
    maxpathheight={size}
    highlightpaths={highlightPaths}
    chartdata={dataBigger}
  /> -->
  <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataInconsistent} /> -->
  <SankeyInspector
    showStores={false}
    showSettings={true}
    bind:showHeaders
    bind:size
    bind:highlightPaths
  />
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
  }
  :global(body) {
    background-color: hsl(0, 0%, 93%);
  }
</style>
