<script lang="ts">
  import "./index.css";
  import { sankeyData as data } from "./testdata/data.customdata.ts";
  import { sankeyData as dataBigger } from "./testdata/data.bigger.ts";
  import { sankeyData as dataNegatives } from "./testdata/data.negatives.ts";
  import SankeyCustomData from "./testdata/SankeyCustomData.svelte";
  import SankeyDataBigger from "./testdata/SankeyDataBigger.svelte";
  import SankeyInspector from "./inspector/Inspector.svelte";
  import SankeyChart from "./lib/components/SankeyChart.svelte";
  import type {
    OnAnchorMouseEnter,
    OnAnchorMouseLeave,
    OnItemClick,
    OnPathClick,
    OnPathMouseEnter,
    OnPathMouseLeave,
    SankeyItem,
  } from "./lib/index.ts";
  import type { OnAnchorClick } from "./lib/components/Anchor.svelte";

  const onItemClick: OnItemClick = (item) => {
    messages.push(JSON.stringify(item));
  };

  const onAnchorClick: OnAnchorClick = (item) => {};
  const onAnchorMouseEnter: OnAnchorMouseEnter = (item) => {};
  const onAnchorMouseLeave: OnAnchorMouseLeave = (item) => {};

  const onPathClick: OnPathClick = ({ source, target }) => {};
  const onPathMouseEnter: OnPathMouseEnter = ({ source, target }) => {};
  const onPathMouseLeave: OnPathMouseLeave = ({ source, target }) => {};

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
  <!-- <SankeyDataBigger
    showheaders={showHeaders}
    maxpathheight={size}
    highlightpaths={highlightPaths}
    chartdata={dataBigger}
  /> -->
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
