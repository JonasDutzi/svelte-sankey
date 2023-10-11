<svelte:options customElement="sv-sankey" />

<script lang="ts">
    import { sankeyStore } from "../stores/sankey";
    import { wrapperStore } from "../stores/wrapper";
    import { pathsStore } from "../stores/paths";

    import SankeyLine from "./SankeyLine.svelte";
    import { onMount } from "svelte";

    export let showheaders: boolean = false;
    export let highlightpaths: boolean = true;
    export let maxpathheight: number = 30;
    export let sankeyid: string | null = null;

    let width;
    let height;

    let wrapperRef: HTMLDivElement;

    $: {
        if (!$sankeyStore.has(sankeyid)) {
            sankeyStore.create(sankeyid);
        }
    }

    $: {
        if (!$wrapperStore.has(sankeyid)) {
            wrapperStore.create(sankeyid);
        }
    }

    $: {
        if ($sankeyStore.get(sankeyid)) {
            $sankeyStore.get(sankeyid).maxPathHeight = maxpathheight;
        }
    }

    $: {
        if ($sankeyStore.get(sankeyid)) {
            $sankeyStore.get(sankeyid).highlightPaths = highlightpaths;
        }
    }

    $: {
        if ($wrapperStore.get(sankeyid)) {
            $wrapperStore.get(sankeyid).width = width;
            $wrapperStore.get(sankeyid).height = height;
        }
    }

    $: {
        if (wrapperRef && $wrapperStore.get(sankeyid)) {
            const wrapperRect = wrapperRef?.getBoundingClientRect();
            $wrapperStore.get(sankeyid).width = wrapperRect.width;
            $wrapperStore.get(sankeyid).height = wrapperRect.height;
            $wrapperStore.get(sankeyid).top = wrapperRect.top;
            $wrapperStore.get(sankeyid).left = wrapperRect.left;
        }
    }
</script>

<div
    data-svsankey-id={sankeyid}
    bind:this={wrapperRef}
    bind:clientWidth={width}
    bind:clientHeight={height}
    style:--grid-auto-flow={showheaders ? "row" : "column"}
    class="svsankey-wrapper"
>
    <svg data-svsankey-id={sankeyid} {width} {height}>
        {#each Array.from($pathsStore) as [key, data]}
            <SankeyLine {sankeyid} {key} {data} />
        {/each}
    </svg>
    <slot />
</div>

<style>
    :global(.svsankey-wrapper) {
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
