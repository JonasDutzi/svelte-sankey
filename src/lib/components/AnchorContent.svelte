<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
  import { createEventDispatcher, type Snippet } from "svelte";
  import type { SankeyItem } from "../types";
  import { sankeyStore } from "../stores/sankey.svelte.ts";

  type SVGPathElement = {
    style: {
      stroke: string | undefined;
    };
  };

  type Props = {
    item: SankeyItem;
    highlightpaths: boolean;
    children?: Snippet;
  };

  let { item, highlightpaths, children }: Props = $props();

  let isPathHighlightingOn = $state(true);

  $effect(() => {
    if (sankeyStore.value.highlightPaths === false) {
      isPathHighlightingOn = false;
    } else {
      isPathHighlightingOn = highlightpaths;
    }
  });

  const dispatch = createEventDispatcher();

  const onContentClicked = () => {
    dispatch("itemclick", { item });
  };

  const onContentMouseEnter = () => {
    if (isPathHighlightingOn) {
      highlightSankeyPaths();
    }
    dispatch("anchormouseenter", { item });
  };

  const onContentMouseLeave = () => {
    if (isPathHighlightingOn) {
      removeSankeyPathsHighlight();
    }
    dispatch("anchormouseleave", { item });
  };

  const highlightSankeyPaths = () => {
    let paths = [
      ...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`),
      ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`),
    ];
    paths.forEach((path) => {
      window.requestAnimationFrame(() => {
        (path as unknown as SVGPathElement).style.stroke = item.anchorColor;
      });
    });
  };

  const removeSankeyPathsHighlight = () => {
    let paths = [
      ...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`),
      ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`),
    ];
    paths.forEach((path) => {
      window.requestAnimationFrame(() => {
        (path as unknown as SVGPathElement).style.stroke = "";
      });
    });
  };
</script>

<div
  class="sv-sankey__anchorcontent"
  role="button"
  tabindex="0"
  onclick={onContentClicked}
  onkeypress={onContentClicked}
  onmouseenter={onContentMouseEnter}
  onmouseleave={onContentMouseLeave}
>
  <slot />
</div>

<style>
  :global(.sv-sankey__anchorcontent) {
    cursor: pointer;
    background-color: rgba(239, 239, 239);
    border: 1px solid rgba(239, 239, 239, 0.2);
    border-radius: 5px;
    z-index: 1;
    margin-inline: 0.75rem;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
  }
</style>
