<svelte:options customElement="svsankey-label" />

<script lang="ts">
    export let label: string;
</script>

<div class="sv-sankey__label">
    <p>{label}</p>
</div>

<style>
    .sv-sankey__label {
        margin-inline: 0.5rem;
        position: relative;
    }
</style>
