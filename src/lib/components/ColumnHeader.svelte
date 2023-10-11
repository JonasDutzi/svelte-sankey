<svelte:options customElement="svsankey-column-header" />

<script lang="ts">
    export let sankeyid: string | null = null;
</script>

<div class="svsankey-column-header" data-svsankey-id={sankeyid}>
    <slot />
</div>

<style>
    :global(.svsankey-column-header) {
        grid-row: 1;
    }
</style>
