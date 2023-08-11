<script lang="ts">
    import { anchorsStore, dataStore, itemsStore, linksStore, pathsStore, settingsStore, wrapperStore } from "../stores/index";
</script>

<div class="inspector">
    <b>Sankey Inspector:</b>
    <div>
        <b>Links:</b>
        {#each Array.from($linksStore) as link}
            <div>{JSON.stringify(link)}</div>
        {/each}
    </div>
    <div>
        <b>Data:</b>
        {#each Array.from($dataStore) as data}
            <div>{JSON.stringify(data)}</div>
        {/each}
    </div>
    <div>
        <b>Items:</b>
        {#each Array.from($itemsStore) as data}
            <div>{JSON.stringify(data)}</div>
        {/each}
    </div>
    <div>
        <b>Anchors:</b>
        {#each Array.from($anchorsStore) as data}
            <div>{JSON.stringify(data)}</div>
        {/each}
    </div>
    <div>
        <b>Paths:</b>
        <!-- <p>{$pathsStore}</p> -->
        {#each Array.from($pathsStore) as data}
            <div>{JSON.stringify(data)}</div>
        {/each}
    </div>
    <div>
        <b>Wrapper:</b>
        <div>{JSON.stringify($wrapperStore)}</div>
    </div>
    <div>
        <b>Settings:</b>
        <div>{JSON.stringify($settingsStore)}</div>
    </div>
</div>

<style>
    .inspector {
        margin-top: 8rem;
    }
    .inspector > div {
        margin: 2rem;
    }
</style>
