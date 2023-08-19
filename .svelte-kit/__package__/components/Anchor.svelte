<svelte:options customElement="svsankey-anchor" />

<script>import { onDestroy } from "svelte";
import { anchorsStore, itemsStore, wrapperStore } from "../stores";
let anchorRef;
export let id;
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
      id,
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
