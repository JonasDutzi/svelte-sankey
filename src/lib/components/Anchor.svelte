<svelte:options customElement="svsankey-anchor" />

<script lang="ts">
  import type { SankeyItem } from "../types";
  import { scaleValue } from "../helper";
  import { itemsStore } from "../stores/items.svelte.ts";
  import { sankeyStore } from "../stores/sankey.svelte.ts";
  import { anchorsStore } from "../stores/anchors.svelte.ts";
  import { wrapperStore } from "../stores/wrapper.svelte.ts";
  import { tick } from "svelte";

  type Props = {
    item: SankeyItem;
  };

  let anchorRef = $state<HTMLDivElement>();
  let { item }: Props = $props();

  let anchorHeight = $state(1);

  $effect(() => {
    if (Object.keys(itemsStore.value).length > 0) {
      const currentItem = itemsStore.value[item.id];
      if (currentItem) {
        const value = Math.max(
          currentItem.totalValues.sources,
          currentItem.totalValues.targets
        );
        anchorHeight = scaleValue(
          value,
          [sankeyStore.value.minPathHeight, sankeyStore.value.maxPathHeight],
          sankeyStore.value.minValue,
          sankeyStore.value.maxValue
        );
        const anchorRect = anchorRef?.getBoundingClientRect();
        console.log(`Anchor rect ${item.id}:  ${JSON.stringify(anchorRect)}`);
        if (anchorRect) {
          anchorsStore.setAnchor({
            id: item.id,
            positionX: anchorRect.x - wrapperStore.value.left,
            positionY: anchorRect.y - wrapperStore.value.top - 8, //why 8?
          });
        }
      }
    }
  });
</script>

<div
  class="sv-sankey__anchor"
  style:--anchor-height="{anchorHeight}px"
  style:--background-color={item.anchorColor}
  bind:this={anchorRef}
></div>

<style>
  :global(.sv-sankey__anchor) {
    z-index: 1;
    width: 15px;
    background-color: var(--background-color);
    height: var(--anchor-height);
  }
</style>
