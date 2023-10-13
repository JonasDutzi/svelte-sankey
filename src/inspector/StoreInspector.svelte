<script lang="ts">
    export let store;
    export let name;
    export let iterable = true;

    $: {
        console.log(`${name}:`);
        console.log(store);
    }
</script>

{#if iterable}
    {#each Array.from(store) as data}
        <div>{JSON.stringify(data)}</div>
    {/each}
{:else}
    <div>{JSON.stringify(store)}</div>
{/if}
