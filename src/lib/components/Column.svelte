<svelte:options customElement="svsankey-column" />

<div class="svsankey-column-wrapper">
    {#if $$slots.label}
        <slot name="label" />
    {/if}
    <slot />
</div>

<style>
    .svsankey-column-wrapper {
        padding: 10px;
    }
</style>
