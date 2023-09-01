<svelte:options customElement="svsankey-column" />

<div class="sv-sankey__column-wrapper">
    {#if $$slots.label}
        <slot name="label" />
    {/if}
    <slot />
</div>

<style>
    .sv-sankey__column-wrapper {
        padding: 10px;
    }
</style>
