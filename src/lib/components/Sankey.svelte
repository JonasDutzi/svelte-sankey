<svelte:options customElement="sv-sankey" />

<script lang="ts">
    import { sankeyStore } from "../stores/sankey";
    import { wrapperStore } from "../stores/wrapper";
    import { pathsStore } from "../stores/paths";

    import SankeyLine from "./SankeyLine.svelte";
    import { onDestroy, onMount } from "svelte";

    export let showheaders: boolean = false;
    export let highlightpaths: boolean = true;
    export let maxpathheight: number = 30;

    let wrapperRef: HTMLDivElement;

    $: {
        $sankeyStore.maxPathHeight = maxpathheight;
    }

    $: {
        $sankeyStore.highlightPaths = highlightpaths;
    }

    $: {
        if (wrapperRef) {
            const wrapperRect = wrapperRef?.getBoundingClientRect();
            $wrapperStore.width = wrapperRect.width;
            $wrapperStore.height = wrapperRect.height;
            $wrapperStore.top = wrapperRect.top;
            $wrapperStore.left = wrapperRect.left;
        }
    }

    const updateSankey = () => {
        wrapperRef = wrapperRef;
    };

    onMount(() => {
        if (window) {
            window.addEventListener("resize", updateSankey);
        }
    });
    onDestroy(() => {
        if (window) {
            window.removeEventListener("resize", updateSankey);
        }
    });
</script>

<div
    bind:this={wrapperRef}
    bind:clientWidth={$wrapperStore.width}
    bind:clientHeight={$wrapperStore.height}
    style:--grid-auto-flow={showheaders ? "row" : "column"}
    class="sv-sankey__wrapper"
>
    <svg width={$wrapperStore.width} height={$wrapperStore.height}>
        {#each Array.from($pathsStore) as [key, data]}
            <SankeyLine {key} {data} />
        {/each}
    </svg>
    <slot />
</div>

<style>
    :global(.sv-sankey__wrapper) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        display: grid;
        grid-auto-flow: var(--grid-auto-flow);
        /* grid-template-rows: max-content; */
        gap: 0.5rem;
        position: relative;
    }
    svg {
        position: absolute;
    }
</style>
