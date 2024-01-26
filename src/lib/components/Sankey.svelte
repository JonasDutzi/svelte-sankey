<svelte:options customElement="sv-sankey" />

<script lang="ts">
    import { sankeyStore } from "../stores/sankey.svelte.ts";
    import { wrapperStore } from "../stores/wrapper.svelte.ts";
    import { pathsStore } from "../stores/paths.svelte.ts";

    import SankeyLine from "./SankeyLine.svelte";
    import type { SvelteComponent } from "svelte";

    let { showheaders, highlightpaths, maxpathheight, children } = $props<{
        showheaders: boolean;
        highlightpaths: boolean;
        maxpathheight: number;
        children: () => {};
    }>();

    let wrapperRef = $state<HTMLDivElement | undefined>();
    let divClientWidth = $state<number>();
    let divClientHeight = $state<number>();
    let svgClientWidth = $state<number>();
    let svgClientHeight = $state<number>();

    $effect(() => {
        sankeyStore.setHighlightPaths(highlightpaths);
    });

    $effect(() => {
        sankeyStore.setMaxPathHeight(maxpathheight);
    });

    $effect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const wrapper = entries.at(0);
            if (wrapper) {
                wrapperStore.set({
                    width: wrapper.contentRect.width,
                    height: wrapper.contentRect.height,
                    top: wrapper.contentRect.top,
                    left: wrapper.contentRect.left
                });
            }
        });
        resizeObserver.observe(wrapperRef!);
        return () => resizeObserver.unobserve(wrapperRef!);
    });
</script>

<div bind:this={wrapperRef} style:--grid-auto-flow={showheaders ? "row" : "column"} class="sv-sankey__wrapper">
    <!-- <svg width={wrapperStore.value.width} height={wrapperStore.value.height}>
        {#each Array.from(pathsStore.value) as [key, data]}
            <SankeyLine {key} {data} />
        {/each}
    </svg> -->
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
