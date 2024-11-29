<script lang="ts">
  import "./index.css";
  import { sankeyData as data } from "./testdata/data.customdata.ts";
  import { sankeyData as dataBigger } from "./testdata/data.bigger.ts";
  import { sankeyData as dataNegatives } from "./testdata/data.negatives.ts";
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

  const onPathClicked = (e: any) => {
    console.log(e.detail);
  };

  const onPathMouseEnter = (e: any) => {
    console.log(e.detail);
  };

  const onPathMouseLeave = (e: any) => {
    console.log(e.detail);
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
  let size = $state(50);
</script>

<main>
  <SankeyChart
    highlightpaths={highlightPaths}
    showheaders={showHeaders}
    maxpathheight={size}
    minpathheight={1}
    chartdata={data}
    on:itemclick={onItemClicked}
    on:anchormouseenter={onAnchorMouseEnter}
    on:anchormouseleave={onAnchorMouseLeave}
    on:pathclick={onPathClicked}
    on:pathmouseenter={onPathMouseEnter}
    on:pathmouseleave={onPathMouseLeave}
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
    showStores={true}
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
