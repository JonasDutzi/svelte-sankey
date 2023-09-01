<svelte:options customElement="svsankey-item" />

<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import Anchor from "./Anchor.svelte";
    import Label from "./Label.svelte";
    import type { SankeyItem } from "../types";
    import { logError } from "../helper";
    import { itemsStore } from "../stores/items";

    export let item: SankeyItem;

    const dispatch = createEventDispatcher();

    $: itemData = $itemsStore.get(item.id);
    $: dataValue = Math.max(itemData?.totalValues?.sources, itemData?.totalValues?.targets);

    onMount(() => {
        if (!item.id) {
            logError("Every Sankey Item must have a key");
        }
    });

    const onButtonClicked = () => {
        dispatch("itemclick", { item: { ...itemData, value: dataValue } });
    };

    const highlightPath = () => {
        let paths = [
            ...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`),
            ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`)
        ];
        paths.forEach((path: HTMLElement) => {
            window.requestAnimationFrame(() => {
                //TODO: replace this with dynamic stroke variable
                path.style.stroke = "rgba(44, 61, 171, 0.6)";
            });
        });
    };

    const removePathHighlight = () => {
        let paths = [
            ...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`),
            ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`)
        ];
        paths.forEach((path: HTMLElement) => {
            window.requestAnimationFrame(() => {
                path.style.stroke = "";
            });
        });
    };
</script>

<div class="sv-sankey__item">
    <Anchor id={item.id} />
    <!-- <Label label={item.label} /> -->
    <button class="btn" on:click={onButtonClicked} on:mouseenter={highlightPath} on:mouseleave={removePathHighlight}>{item.label}: {dataValue}</button>

    <slot />
</div>

<style>
    :global(.sv-sankey__item) {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-direction: row;
        margin-block: 1em;
    }
    .btn {
        cursor: pointer;
        background-color: white;
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: 5px;
        z-index: 1;
        margin-inline: 0.75rem;
    }

    .btn:hover {
        background-color: rgb(239, 239, 239);
    }
</style>
