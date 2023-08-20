<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { SankeyColumn } from "../types";
    import { dataStore } from "../../stores";

    export let data: SankeyColumn;

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
