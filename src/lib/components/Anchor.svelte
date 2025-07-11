<svelte:options customElement="svsankey-anchor" />

<script lang="ts">
  import type { OnAnchorClick, SankeyItem } from "../types";
  import { scaleValue } from "../helper";
  import { itemsStore } from "../stores/items.svelte.ts";
  import { sankeyStore } from "../stores/sankey.svelte.ts";
  import { anchorsStore } from "../stores/anchors.svelte.ts";
  import { wrapperStore } from "../stores/wrapper.svelte.ts";
  import { type Snippet } from "svelte";
  import Children from "./Children.svelte";

  type Props = {
    item: SankeyItem;
    onAnchorClick?: OnAnchorClick;
    children?: Snippet;
  };

  let anchorRef = $state<HTMLButtonElement>();
  let { item, onAnchorClick, children }: Props = $props();

  let anchorHeight = $state(1);

  let currentItem: any = $derived.by(() => itemsStore.value[item.id]);

  $effect(() => {
    if (currentItem) {
      const value = Math.max(
        currentItem.totalValues.sources,
        currentItem.totalValues.targets
      );
      const scaledValue = scaleValue(
        value,
        [sankeyStore.value.minPathHeight, sankeyStore.value.maxPathHeight],
        sankeyStore.value.minValue,
        sankeyStore.value.maxValue
      );
      if (scaledValue !== 0) {
        anchorHeight = scaledValue;
      }
      const anchorRect = anchorRef?.getBoundingClientRect();
      if (anchorRect) {
        anchorsStore.setAnchor({
          id: item.id,
          positionX: anchorRect.x - wrapperStore.value.left,
          positionY: anchorRect.y - wrapperStore.value.top,
          anchorColor: item.anchorColor,
        });
      }
    }
  });

  const onAnchorClicked = () => {
    onAnchorClick?.(item);
  };
</script>

<button
  class="sv-sankey__anchor"
  data-sankey-key={item.id}
  style:--anchor-height="{anchorHeight}px"
  style:--background-color={item.anchorColor}
  bind:this={anchorRef}
  onclick={onAnchorClicked}
>
  <Children {children}></Children>
</button>

<style>
  :global(.sv-sankey__anchor) {
    z-index: 1;
    width: 20px;
    background-color: var(--background-color);
    height: var(--anchor-height);
    border: none;
  }
  /* .sv-sankey__anchor:hover {
    cursor: pointer;
    transform: scaleX(5.5);
    transform-origin: left;
    transition-duration: 400ms;
  } */
</style>
