<svelte:options customElement="svsankey-label" />

<script>export let label;
</script>

<div class="sv-sankey__label">
    <p>{label}</p>
</div>

<style>
    p {
        margin: 0;
        padding: 0;
    }
    .sv-sankey__label {
        margin-inline: 0.5rem;
        position: relative;
    }
    .sv-sankey__label::before {
        content: "";
        position: absolute;
        inset: 0;
    }
</style>
