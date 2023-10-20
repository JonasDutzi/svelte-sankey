<script lang="ts">
    export let store;
    export let name;
    export let iterable = true;

    let storeData;

    $: {
        storeData = store.get("testid") ?? [];
    }
</script>

{#each Array.from(storeData) as data}
    <div>{JSON.stringify(data)}</div>
{/each}
{#if name === "Wrapper" || name === "Sankey"}
    {#each Array.from(store) as data}
        <div>{JSON.stringify(data)}</div>
    {/each}
    <!-- content here -->
{/if}
<!-- {#each stores as aStore}
    <div>{JSON.stringify(aStore)}</div>
{/each} -->
