<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SankeyItem } from "../types";
    import { sankeyStore } from "../stores/sankey";

    export let item: SankeyItem;
    export let sankeyid: string | null = null;
    export let highlightpaths = true;

    let isPathHighlightingOn;

    $: {
        if ($sankeyStore.get(sankeyid).highlightPaths === false) {
            isPathHighlightingOn = false;
        } else {
            isPathHighlightingOn = highlightpaths;
        }
    }

    const dispatch = createEventDispatcher();

    const onContentClicked = () => {
        dispatch("itemclick", { item });
    };

    const onContentMouseEnter = () => {
        if (isPathHighlightingOn) {
            highlightSankeyPaths();
        }
        dispatch("anchormouseenter", { item });
    };

    const onContentMouseLeave = () => {
        if (isPathHighlightingOn) {
            removeSankeyPathsHighlight();
        }
        dispatch("anchormouseleave", { item });
    };

    const highlightSankeyPaths = () => {
        let paths = [
            ...document.querySelectorAll(`[data-svsankey-source=path-${item.id}]`),
            ...document.querySelectorAll(`[data-svsankey-target=path-${item.id}]`)
        ];
        paths.forEach((path: HTMLElement) => {
            window.requestAnimationFrame(() => {
                path.style.stroke = item.anchorColor;
            });
        });
    };

    const removeSankeyPathsHighlight = () => {
        let paths = [
            ...document.querySelectorAll(`[data-svsankey-source=path-${item.id}]`),
            ...document.querySelectorAll(`[data-svsankey-target=path-${item.id}]`)
        ];
        paths.forEach((path: HTMLElement) => {
            window.requestAnimationFrame(() => {
                path.style.stroke = "";
            });
        });
    };
</script>

<div
    class="svsankey-anchor-content"
    data-svsankey-id={sankeyid}
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
    :global(.svsankey-anchor-content) {
        cursor: pointer;
        background-color: rgba(239, 239, 239);
        border: 1px solid rgba(239, 239, 239, 0.2);
        border-radius: 5px;
        z-index: 1;
        margin-inline: 0.75rem;
        padding-inline: 0.5rem;
        padding-block: 0.25rem;
    }
</style>
