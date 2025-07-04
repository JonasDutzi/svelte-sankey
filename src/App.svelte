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
  import type { SankeyItem } from "./lib/index.ts";
  import type { OnAnchorClick } from "./lib/components/Anchor.svelte";

  const onItemClick = (item: SankeyItem) => {
    messages.push(JSON.stringify(item));
  };

  const onAnchorMouseEnter = (item: SankeyItem) => {};

  const onAnchorMouseLeave = (item: SankeyItem) => {};

  const onPathClick = (e: any) => {};

  const onAnchorClick: OnAnchorClick = (item) => {
    console.log(item);
  };

  const onPathMouseEnter = () => {};

  const onPathMouseLeave = () => {};

  //basic example of resizing based on window breakpoints
  $effect(() => {
    window.addEventListener("resize", () => {
      console.log("resized");
      if (window.innerWidth > 1025) {
        return; //use default size
      } else if (window.innerWidth > 768) {
        size = 150;
      } else {
        size = 60;
      }
    });
  });

  let messages = $state<Array<string>>([]);

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
    {onItemClick}
    {onAnchorClick}
    {onAnchorMouseEnter}
    {onAnchorMouseLeave}
    {onPathClick}
    {onPathMouseEnter}
    {onPathMouseLeave}
  />
  <!-- <SankeyCustomData showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={customData} /> -->
  <!-- <SankeyDataBigger
    showheaders={showHeaders}
    maxpathheight={size}
    highlightpaths={highlightPaths}
    chartdata={dataBigger}
  /> -->
  <!-- <SankeyDataBigger showheaders={showHeaders} maxpathheight={size} highlightpaths={highlightPaths} chartdata={dataInconsistent} /> -->
  <div>
    <ul>
      {#each messages as message}
        <li>{message}</li>{/each}
    </ul>
  </div>
  <!-- <SankeyInspector
    showStores={true}
    showSettings={true}
    bind:showHeaders
    bind:size
    bind:highlightPaths
  /> -->
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
