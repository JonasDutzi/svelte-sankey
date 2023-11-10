<svelte:options customElement="svsankey-item" />

<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { SankeyItem } from "../types";
    import { logError } from "../helper";
    import { itemsStore } from "../stores/items";
    import { linksStore } from "../stores/links";
    import { sankeyStore } from "../stores/sankey";

    export let item: SankeyItem;

    $: itemData = $itemsStore.get(item.id);
    $: dataValue = Math.max(itemData?.totalValues?.sources, itemData?.totalValues?.targets);

    $: {
        if (!item.id) {
            logError("Every Sankey Item must have a key");
        }

        if (item.links) {
            for (const link of item.links) {
                if (!link.target) {
                    logError(`Sankey Link must have a target. Item "${item.id}" does have an empty target.`);
                }
                linksStore.add({
                    source: item.id,
                    target: link.target,
                    value: link.value,
                    strokeColor: link.strokeColor,
                    strokeColorHover: link.strokeColorHover
                });
                if (link.value && link.value > $sankeyStore.maxValue) {
                    $sankeyStore.maxValue = link.value;
                }

                if (link.value && $sankeyStore.minValue) {
                    if ($sankeyStore.minValue > link.value) {
                        $sankeyStore.minValue = link.value;
                    }
                } else {
                    $sankeyStore.minValue = link.value;
                }
            }
        }
    }
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
