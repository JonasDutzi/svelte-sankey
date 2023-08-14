<svelte:options customElement="svsankey-columns" />

<script lang="ts">
    export let data: any;
</script>

{#each data as column}
    <slot {column} name="column-header" />
    <slot {column} name="column-content" />
{/each}
