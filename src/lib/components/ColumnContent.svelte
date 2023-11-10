<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
    import { onDestroy } from "svelte";
    import type { SankeyColumn } from "../types";
    import { dataStore } from "../stores/data";

    export let data: SankeyColumn;

    $: {
        if (!$dataStore.has(data.id)) {
            dataStore.addColumn(data);
        }
    }

    onDestroy(() => {
        dataStore.removeColumn(data);
    });
</script>

<div class="sv-sankey__column-content">
    <slot />
</div>

<style>
    :global(.sv-sankey__column-content) {
    }
</style>
