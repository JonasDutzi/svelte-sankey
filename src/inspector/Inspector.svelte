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
        // { store: $linksStore, name: "Links", iterable: true },
        { store: $dataStore, name: "Data", iterable: true },
        { store: $itemsStore, name: "Items", iterable: true },
        { store: $anchorsStore, name: "Anchors", iterable: true },
        { store: $pathsStore, name: "Paths", iterable: true },
        { store: $wrapperStore, name: "Wrapper", iterable: false },
        { store: $sankeyStore, name: "Sankey", iterable: false }
    ];
</script>

<div class="inspector">
    <b>Sankey Inspector:</b>
    <div class="stores">
        {#each stores as { store, name, iterable }}
            <div class="store-name"><b>{name}</b></div>
            <StoreInspector {store} {iterable} />
        {/each}
    </div>
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
