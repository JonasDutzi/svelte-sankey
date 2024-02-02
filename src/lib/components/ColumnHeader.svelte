<svelte:options customElement="svsankey-column-header" />

<script lang="ts">
    let { children } = $props<{
        children?: () => {};
    }>();
</script>

<div class="sv-sankey__column-header">
    <slot />
</div>

<style>
    :global(.sv-sankey__column-header) {
        grid-row: 1;
    }
</style>
