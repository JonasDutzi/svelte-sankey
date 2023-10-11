<svelte:options customElement="svsankey-item" />

<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { SankeyItem } from "../types";
    import { logError } from "../helper";
    import { itemsStore } from "../stores/items";
    import { linksStore } from "../stores/links";
    import { sankeyStore } from "../stores/sankey";

    export let sankeyid: string | null = null;
    export let item: SankeyItem;
    let data;

    $: itemData = $itemsStore.get(item.id);
    $: dataValue = Math.max(itemData?.totalValues?.sources, itemData?.totalValues?.targets);
    $: data = { ...itemData, value: dataValue };

    onMount(() => {
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
                if (link.value && link.value > $sankeyStore.get(sankeyid).maxValue) {
                    $sankeyStore.get(sankeyid).maxValue = link.value;
                }

                if (link.value && $sankeyStore.get(sankeyid).minValue) {
                    if ($sankeyStore.get(sankeyid).minValue > link.value) {
                        $sankeyStore.get(sankeyid).minValue = link.value;
                    }
                } else {
                    $sankeyStore.get(sankeyid).minValue = link.value;
                }
            }
        }
    });

    onDestroy(() => {
        if (item.links) {
            for (const link of item.links) {
                linksStore.remove({ source: item.id, target: link.target, value: link.value });
            }
        }
    });
</script>

<div class="svsankey-item" data-svsankey-id={sankeyid}>
    <slot />
</div>

<style>
    :global(.svsankey-item) {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-direction: row;
        margin-block: 1em;
    }
</style>
