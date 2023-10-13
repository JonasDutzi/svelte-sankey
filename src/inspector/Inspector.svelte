<script lang="ts">
    import { anchorsStore } from "../lib/stores/anchors";
    import { dataStore } from "../lib/stores/data";
    import { itemsStore } from "../lib/stores/items";
    import { linksStore } from "../lib/stores/links";
    import { pathsStore } from "../lib/stores/paths";
    import { sankeyStore } from "../lib/stores/sankey";
    import { wrapperStore } from "../lib/stores/wrapper";
    import StoreInspector from "./StoreInspector.svelte";

    $: stores = [
        { store: $linksStore, name: "Links", iterable: true },
        { store: $dataStore, name: "Data", iterable: true },
        { store: $itemsStore, name: "Items", iterable: true },
        { store: $anchorsStore, name: "Anchors", iterable: true },
        { store: $pathsStore, name: "Paths", iterable: true },
        { store: $wrapperStore, name: "Wrapper", iterable: true },
        { store: $sankeyStore, name: "Sankey", iterable: true }
    ];

    export let size = 30;
    export let showHeaders = true;
    export let highlightPaths = true;
    export let showStores = true;
    export let showSettings = true;
</script>

<div class="inspector">
    <b>Sankey Inspector:</b>
    <div>
        <label for="showHeaders">Settings</label>
        <input id="showHeaders" type="checkbox" bind:checked={showSettings} />
        <label for="showStores">Stores</label>
        <input id="showStores" type="checkbox" bind:checked={showStores} />
    </div>

    {#if showSettings}
        <p style="margin-bottom: 1rem;">Settings/Props:</p>
        <div style="display: flex; align-items: center; gap: 2rem">
            <div>
                <div>Size (maxpathheight):</div>
                <input type="range" min="1" max="200" bind:value={size} />
            </div>
            <div>
                <div>Headers (showheaders):</div>
                <input type="checkbox" bind:checked={showHeaders} />
            </div>
            <div>
                <div>Highlight Paths (highlightpaths):</div>
                <input type="checkbox" bind:checked={highlightPaths} />
            </div>
            <div style="margin-bottom: 2rem;" />
        </div>
        <div style="margin-bottom: 3rem;">__________________________________________________</div>
    {/if}
    {#if showStores}
        <div class="stores">
            {#each stores as { store, name, iterable }}
                <div class="store-name"><b>{name}</b></div>
                <StoreInspector {store} {name} {iterable} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .inspector {
        margin-top: 8rem;
    }
    .stores {
        margin: 2rem;
    }
    .store-name {
        margin-block: 1rem;
    }
</style>
