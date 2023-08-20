<svelte:options customElement="sv-sankey" />

<script lang="ts">
    import { pathsStore, wrapperStore, settingsStore } from "../stores";
    import SankeyLine from "./SankeyLine.svelte";

    export let showHeaders: boolean = false;
    export let maxBoxHeight: number = 30;

    let wrapperRef: HTMLDivElement;
    export let minPathWidth: number = 1;

    $: {
        if (maxBoxHeight) {
            $settingsStore.maxBoxHeight = maxBoxHeight;
            $settingsStore.minPathWidth = minPathWidth;
        }
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
</script>

<div
    bind:this={wrapperRef}
    bind:clientWidth={$wrapperStore.width}
    bind:clientHeight={$wrapperStore.height}
    style:--grid-auto-flow={showHeaders ? "row" : "column"}
    class="sv-sankey__wrapper"
>
    <svg width={$wrapperStore.width} height={$wrapperStore.height}>
        {#each Array.from($pathsStore) as [key, data]}
            <SankeyLine {minPathWidth} {key} {data} />
        {/each}
    </svg>
    <slot />
</div>

<style>
    :global(.sv-sankey__wrapper) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: black 3px solid;
        display: grid;
        grid-auto-flow: var(--grid-auto-flow);
        /* grid-template-rows: max-content; */
        gap: 0.5rem;
        /* padding: 1.4rem; */
        /* margin-top: 3rem; */
        /* overflow-x: scroll; */
        position: relative;
    }
    svg {
        position: absolute;
    }
</style>
