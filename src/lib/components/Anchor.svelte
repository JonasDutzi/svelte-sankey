<svelte:options customElement="svsankey-anchor" />

<script lang="ts">
    import { onDestroy } from "svelte";
    import type { SankeyItem, SankeyKey } from "../types";
    import { itemsStore } from "../stores/items";
    import { wrapperStore } from "../stores/wrapper";
    import { anchorsStore } from "../stores/anchors";
    import { scaleValue } from "../helper";
    import { sankeyStore } from "../stores/sankey";

    let anchorRef: HTMLDivElement;
    export let item: SankeyItem;
    export let backgroundcolor = "darkblue";

    let anchorHeight = 1;

    $: {
        let currentItem = $itemsStore.get(item.id);
        if (currentItem) {
            const value = Math.max(currentItem.totalValues.sources, currentItem.totalValues.targets);
            anchorHeight = scaleValue(value, [$sankeyStore.minPathHeight, $sankeyStore.maxPathHeight], $sankeyStore.minValue, $sankeyStore.maxValue);
        }
    }

    $: {
        if (anchorRef) {
            const rect = anchorRef.getBoundingClientRect();
            anchorsStore.setAnchor({
                id: item.id,
                positionX: rect.x - $wrapperStore.left,
                positionY: rect.y - $wrapperStore.top
            });
        }
    }

    onDestroy(() => {
        anchorsStore.remove(item.id);
    });
</script>

<div class="sv-sankey__anchor" style:--anchor-height="{anchorHeight}px" style:--background-color={backgroundcolor} bind:this={anchorRef} />

<style>
    :global(.sv-sankey__anchor) {
        z-index: 1;
        width: 15px;
        background-color: var(--background-color);
        height: var(--anchor-height);
    }
</style>
