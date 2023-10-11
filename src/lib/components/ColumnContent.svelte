<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { SankeyColumn } from "../types";
    import { dataStore } from "../stores/data";

    export let sankeyid: string | null = null;
    export let data: SankeyColumn;

    onMount(() => {
        dataStore.addColumn(data);
    });

    onDestroy(() => {
        dataStore.removeColumn(data);
    });
</script>

<div class="svsankey-column-content" data-svsankey-id={sankeyid}>
    <slot />
</div>

<style>
    :global(.svsankey-column-content) {
    }
</style>
