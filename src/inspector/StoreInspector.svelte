<script lang="ts">
    type Props = {
        store: any;
        iterable: boolean;
    };
    let { store, iterable }: Props = $props();
</script>

{#if iterable}
    {#each Array.from(store) as data}
        <div>{JSON.stringify(data)}</div>
    {/each}
{:else}
    <div>{JSON.stringify(store)}</div>
{/if}
