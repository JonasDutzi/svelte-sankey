<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ItemData } from "../types";
    import { sankeyStore } from "../stores/sankey";

    export let itemdata: ItemData;
    export let highlightpaths = true;
    let isPathHighlightingOn;

    $: {
        if ($sankeyStore.highlightPaths === false) {
            isPathHighlightingOn = false;
        } else {
            isPathHighlightingOn = highlightpaths;
        }
    }

    const dispatch = createEventDispatcher();

    const onContentClicked = () => {
        dispatch("itemclick", { item: itemdata });
    };

    const onContentMouseEnter = () => {
        if (isPathHighlightingOn) {
            highlightSankeyPaths();
        }
        dispatch("anchormouseenter", { item: itemdata });
    };

    const onContentMouseLeave = () => {
        if (isPathHighlightingOn) {
            removeSankeyPathsHighlight();
        }
        dispatch("anchormouseleave", { item: itemdata });
    };

    const highlightSankeyPaths = () => {
        let paths = [
            ...document.querySelectorAll(`[data-sankey-source=path-${itemdata.id}]`),
            ...document.querySelectorAll(`[data-sankey-target=path-${itemdata.id}]`)
        ];
        paths.forEach((path: HTMLElement) => {
            window.requestAnimationFrame(() => {
                //TODO: replace this with dynamic stroke variable
                path.style.stroke = "rgba(44, 61, 171, 0.6)";
            });
        });
    };

    const removeSankeyPathsHighlight = () => {
        let paths = [
            ...document.querySelectorAll(`[data-sankey-source=path-${itemdata.id}]`),
            ...document.querySelectorAll(`[data-sankey-target=path-${itemdata.id}]`)
        ];
        paths.forEach((path: HTMLElement) => {
            window.requestAnimationFrame(() => {
                path.style.stroke = "";
            });
        });
    };
</script>

<div
    class="sv-sankey__anchorcontent"
    role="button"
    tabindex="0"
    on:click={onContentClicked}
    on:keypress={onContentClicked}
    on:mouseenter={onContentMouseEnter}
    on:mouseleave={onContentMouseLeave}
>
    <slot />
</div>

<style>
    :global(.sv-sankey__anchorcontent) {
        cursor: pointer;
        background-color: white;
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: 5px;
        z-index: 1;
        margin-inline: 0.75rem;
    }

    :global(.sv-sankey__anchorcontent) {
        background-color: rgb(239, 239, 239);
    }
</style>
