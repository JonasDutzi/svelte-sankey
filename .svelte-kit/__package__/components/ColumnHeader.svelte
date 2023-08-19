<svelte:options customElement="svsankey-column-header" />

<div class="sv-sankey__column-header">
    <slot />
</div>

<style>
    :global(.sv-sankey__column-header) {
        grid-row: 1;
    }
</style>
