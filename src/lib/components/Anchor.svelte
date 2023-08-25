<svelte:options customElement="svsankey-anchor" />

<script lang="ts">
    import { onDestroy } from "svelte";
    import type { SankeyKey } from "../types";
    import { itemsStore } from "../stores/items";
    import { wrapperStore } from "../stores/wrapper";
    import { anchorsStore } from "../stores/anchors";

    let anchorRef: HTMLDivElement;
    export let id: SankeyKey;

    let anchorHeight = 1;

    $: {
        let item = $itemsStore.get(id);
        if (item) {
            anchorHeight = Math.max(item.sourcesTotalValue, item.targetsTotalValue);
        }
    }

    $: {
        if (anchorRef) {
            const rect = anchorRef.getBoundingClientRect();
            anchorsStore.setAnchor({
                id: id,
                positionX: rect.x - $wrapperStore.left,
                positionY: rect.y - $wrapperStore.top
            });
        }
    }

    onDestroy(() => {
        anchorsStore.remove(id);
    });
</script>

<div style:--anchor-height="{anchorHeight}px" bind:this={anchorRef} />

<style>
    div {
        z-index: 1;
        width: 15px;
        background-color: darkblue;
        height: var(--anchor-height);
    }
</style>
