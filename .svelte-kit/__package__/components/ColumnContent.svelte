<svelte:options customElement="svsankey-column-content" />

<script>import { onDestroy, onMount } from "svelte";
import { dataStore } from "../../stores";
export let data;
onMount(() => {
  dataStore.addColumn(data);
});
onDestroy(() => {
  dataStore.removeColumn(data);
});
</script>

<div class="sv-sankey__column-content">
    <slot />
</div>

<style>
    :global(.sv-sankey__column-content) {
        outline: black 1px solid;
    }
</style>
