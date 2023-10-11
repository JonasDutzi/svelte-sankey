<svelte:options customElement="svsankey-group" />

<div class="svsankey-group-header">
    <slot name="header" />
    <slot />
</div>

<style>
    .svsankey-group-header {
        margin-block: 1rem;
    }
</style>
