<script lang="ts">
    let { store, iterable } = $props<{ store: any; iterable: boolean }>();
</script>

{#if iterable}
    {#each Array.from(store) as data}
        <div>{JSON.stringify(data)}</div>
    {/each}
{:else}
    <div>{JSON.stringify(store)}</div>
{/if}
