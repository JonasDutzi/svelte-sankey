<svelte:options customElement="svsankey-label" />

<script lang="ts">
    export let label: string;
</script>

<div class="svsankey-label">
    <p>{label}</p>
</div>

<style>
    .svsankey-label {
        margin-inline: 0.5rem;
        position: relative;
    }
</style>
