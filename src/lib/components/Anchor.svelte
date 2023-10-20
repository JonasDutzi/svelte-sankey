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
    export let sankeyid: string | null = null;
    export let item: SankeyItem;

    let anchorHeight = 1;

    $: {
        let currentItem = $itemsStore.has(sankeyid) ? $itemsStore.get(sankeyid).get(item.id) : null;
        if (currentItem) {
            const value = Math.max(currentItem.totalValues.sources, currentItem.totalValues.targets);
            anchorHeight = scaleValue(
                value,
                [$sankeyStore.get(sankeyid).minPathHeight, $sankeyStore.get(sankeyid).maxPathHeight],
                $sankeyStore.get(sankeyid).minValue,
                $sankeyStore.get(sankeyid).maxValue
            );
        }
    }

    $: {
        console.log("anchorRef changed");
        if (anchorRef) {
            anchorHeight = anchorHeight; // needed for svelte reactivity
            const rect = anchorRef.getBoundingClientRect();
            anchorsStore.add(sankeyid, {
                id: item.id,
                positionX: rect.x - $wrapperStore.get(sankeyid).left,
                positionY: rect.y - $wrapperStore.get(sankeyid).top
            });
        }
    }

    onDestroy(() => {
        anchorsStore.remove(sankeyid, item.id);
    });
</script>

<div
    class="svsankey-anchor"
    data-svsankey-id={sankeyid}
    style:--anchor-height="{anchorHeight}px"
    style:--background-color={item.anchorColor}
    bind:this={anchorRef}
/>

<style>
    :global(.svsankey-anchor) {
        z-index: 1;
        width: 15px;
        background-color: var(--background-color);
        height: var(--anchor-height);
    }
</style>
