<svelte:options customElement="svsankey-anchor" />

<script lang="ts">
    import { onDestroy } from "svelte";
    import type { SankeyItem, SankeyKey } from "../types";
    import { scaleValue } from "../helper";
    import { itemsStore } from "../stores/items.svelte.ts";
    import { sankeyStore } from "../stores/sankey.svelte.ts";
    import { anchorsStore } from "../stores/anchors.svelte.ts";
    import { wrapperStore } from "../stores/wrapper.svelte.ts";
    import { dataStore } from "../stores/data.svelte.ts";

    let anchorRef: HTMLDivElement;
    export let item: SankeyItem;

    let anchorHeight = 1;
    let currentItem;

    $: {
        // currentItem = itemsStore.value.get(item.id);
        // console.log(currentItem);
    }

    $: {
        let currentItem = itemsStore.value[item.id];
        if (currentItem) {
            const value = Math.max(currentItem.totalValues.sources, currentItem.totalValues.targets);
            anchorHeight = scaleValue(
                value,
                [sankeyStore.value.minPathHeight, sankeyStore.value.maxPathHeight],
                sankeyStore.value.minValue,
                sankeyStore.value.maxValue
            );
        }
    }

    $: {
        if (anchorRef) {
            anchorHeight = anchorHeight; // needed for svelte reactivity
            const rect = anchorRef.getBoundingClientRect();
            anchorsStore.setAnchor({
                id: item.id,
                positionX: rect.x - wrapperStore.value.left,
                positionY: rect.y - wrapperStore.value.top
            });
        }
    }

    onDestroy(() => {
        anchorsStore.remove(item.id);
    });
</script>

<div class="sv-sankey__anchor" style:--anchor-height="{anchorHeight}px" style:--background-color={item.anchorColor} bind:this={anchorRef} />

<style>
    :global(.sv-sankey__anchor) {
        z-index: 1;
        width: 15px;
        background-color: var(--background-color);
        height: var(--anchor-height);
    }
</style>
