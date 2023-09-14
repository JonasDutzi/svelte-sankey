<script lang="ts">
    export let store;
    export let iterable = true;
</script>

{#if iterable}
    {#each Array.from(store) as data}
        <div>{JSON.stringify(data)}</div>
    {/each}
{:else}
    <div>{JSON.stringify(store)}</div>
{/if}
