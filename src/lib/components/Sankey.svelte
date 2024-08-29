<svelte:options customElement="sv-sankey" />

<script lang="ts">
  import { sankeyStore } from "../stores/sankey.svelte.ts";
  import { wrapperStore } from "../stores/wrapper.svelte.ts";
  import { pathsStore } from "../stores/paths.svelte.ts";

  import SankeyLine from "./SankeyLine.svelte";
  import type { Snippet } from "svelte";
  import Children from "./Children.svelte";
  import { anchorsStore } from "../stores/anchors.svelte.ts";
  import Gradient from "./Gradient.svelte";

  type Props = {
    showheaders: boolean;
    highlightpaths: boolean;
    maxpathheight: number;
    children?: Snippet;
  };

  let { showheaders, highlightpaths, maxpathheight, children }: Props =
    $props();

  let wrapperRef = $state<HTMLDivElement | undefined>();

  $effect(() => {
    sankeyStore.setHighlightPaths(highlightpaths);
  });

  $effect(() => {
    sankeyStore.setMaxPathHeight(maxpathheight);
  });

  $effect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const wrapper = entries.at(0);
      if (wrapper) {
        const clientRect = wrapperRef?.getBoundingClientRect();
        if (clientRect) {
          wrapperStore.set({
            width: clientRect.width,
            height: clientRect.height,
            top: clientRect.top,
            left: clientRect.left,
          });
        }
      }
    });
    resizeObserver.observe(wrapperRef!);
    return () => resizeObserver.unobserve(wrapperRef!);
  });
</script>

<div
  bind:this={wrapperRef}
  style:--grid-auto-flow={showheaders ? "row" : "column"}
  class="sv-sankey__wrapper"
>
  <svg width={wrapperStore.value.width} height={wrapperStore.value.height}>
    <defs>
      {#each Object.entries(pathsStore.value) as [pathKey, pathData]}
        <Gradient key={pathKey} />
      {/each}
    </defs>
    {#each Object.entries(pathsStore.value) as [key, data]}
      <SankeyLine
        {key}
        {data}
        on:pathclick
        on:pathmouseenter
        on:pathmouseleave
      />
    {/each}
  </svg>
  <Children {children}></Children>
</div>

<style>
  :global(.sv-sankey__wrapper) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: grid;
    grid-auto-flow: var(--grid-auto-flow);
    /* grid-template-rows: max-content; */
    gap: 0.5rem;
    position: relative;
  }
  svg {
    position: absolute;
  }
</style>
