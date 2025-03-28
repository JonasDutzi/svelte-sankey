<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
    import { createEventDispatcher, type Snippet } from "svelte";
    import type { SankeyItem } from "../types";
    import { sankeyStore } from "../stores/sankey.svelte.ts";
    import Children from "./Children.svelte";

    type Props = {
        item: SankeyItem;
        highlightpaths: boolean;
        children?: Snippet;
    };

    let { item, highlightpaths, children }: Props = $props();

    let isPathHighlightingOn = $derived.by(() => {
        if (sankeyStore.value.highlightPaths === false) {
            return false;
        } else {
            return highlightpaths;
        }
    });

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
            ...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`),
            ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`)
        ];
        paths.forEach((path) => {
            window.requestAnimationFrame(() => {
                (path as unknown as SVGPathElement).classList.add("focused-path");
            });
        });
    };

    const removeSankeyPathsHighlight = () => {
        let paths = [
            ...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`),
            ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`)
        ];
        paths.forEach((path) => {
            window.requestAnimationFrame(() => {
                (path as unknown as SVGPathElement).classList.remove("focused-path");
            });
        });
    };
</script>

<button class="sv-sankey__anchorcontent" onclick={onContentClicked} onmouseenter={onContentMouseEnter} onmouseleave={onContentMouseLeave}>
    <Children {children}></Children>
</button>

<style>
    :global(.sv-sankey__anchorcontent) {
        cursor: pointer;
        background-color: rgba(255, 255, 255);
        border: 1px solid rgba(239, 239, 239, 0.2);
        border-radius: 5px;
        z-index: 1;
        margin-inline: 0.75rem;
        padding-inline: 1rem;
        padding-block: 0.5rem;
    }

    :global(.sv-sankey__anchorcontent:hover) {
        background-color: rgb(208, 208, 208);
    }
</style>
