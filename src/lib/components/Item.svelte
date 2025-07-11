<svelte:options customElement="svsankey-item" />

<script lang="ts">
  import type { SankeyItem } from "../types";
  import { logError } from "../helper";
  import { linksStore } from "../stores/links.svelte.ts";
  import { sankeyStore } from "../stores/sankey.svelte.ts";
  import type { Snippet } from "svelte";

  type Props = {
    item: SankeyItem;
    children?: Snippet;
  };

  let { item, children }: Props = $props();

  $effect(() => {
    if (!item.id) {
      logError("Every Sankey Item must have a key");
    }

    if (item.links) {
      for (const link of item.links) {
        if (!link.target) {
          logError(
            `Sankey Link must have a target. Item "${item.id}" does have an empty target.`
          );
        }
        linksStore.add({
          source: item.id,
          target: link.target,
          value: link.value,
          strokeColor: link.strokeColor,
          strokeColorHover: link.strokeColorHover,
        });
        if (link.value && link.value > sankeyStore.value.maxValue) {
          sankeyStore.setMaxValue(link.value);
        }

        if (link.value && link.value > 0 && sankeyStore.value.minValue) {
          if (sankeyStore.value.minValue > link.value) {
            sankeyStore.value.minValue = link.value;
          }
        }
      }
    }
    return () => {
      if (item.links) {
        for (const link of item.links) {
          linksStore.remove({
            source: item.id,
            target: link.target,
            value: link.value,
          });
        }
      }
    };
  });
</script>

<div class="sv-sankey__item">
  <slot />
</div>

<style>
  :global(.sv-sankey__item) {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: row;
    margin-block: 1em;
  }
</style>
