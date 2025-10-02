<svelte:options
	customElement={{
		tag: "sv-sankey"
	}}
/>

<script lang="ts">
	import { sankeyStore } from "../stores/sankey.svelte.ts";
	import { wrapperStore } from "../stores/wrapper.svelte.ts";
	import { pathsStore } from "../stores/paths.svelte.ts";

	import SankeyLine from "./SankeyLine.svelte";
	import type { Snippet } from "svelte";
	import Gradient from "./Gradient.svelte";
	import type { OnPathClick, OnPathMouseEnter, OnPathMouseLeave } from "../types/index.ts";

	type Props = {
		highlightpaths?: boolean;
		maxpathheight?: number;
		minpathheight?: number;
		onPathClick?: OnPathClick;
		onPathMouseEnter?: OnPathMouseEnter;
		onPathMouseLeave?: OnPathMouseLeave;
		children?: Snippet;
	};

	let { highlightpaths = true, maxpathheight = 32, minpathheight = 1, onPathClick, onPathMouseEnter, onPathMouseLeave, children }: Props = $props();

	let wrapperRef = $state<HTMLDivElement | undefined>();

	$effect(() => {
		sankeyStore.highlightPaths = highlightpaths;
	});

	$effect(() => {
		sankeyStore.maxPathHeight = maxpathheight;
	});

	$effect(() => {
		sankeyStore.minPathHeight = minpathheight;
	});

	// Set loading to false when paths are calculated and ready
	$effect(() => {
		if (Object.keys(pathsStore.data).length > 0) {
			sankeyStore.isLoading = false;
		}
	});

	$effect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const wrapper = entries.at(0);
			if (wrapper) {
				const clientRect = wrapperRef?.getBoundingClientRect();
				if (clientRect) {
					wrapperStore.set({
						width: clientRect.width,
						height: clientRect.height,
						top: clientRect.top,
						left: clientRect.left
					});
				}
			}
		});
		resizeObserver.observe(wrapperRef!);
		return () => resizeObserver.unobserve(wrapperRef!);
	});
</script>

<div bind:this={wrapperRef} class="sv-sankey__wrapper" role="application" aria-label="Sankey diagram - Use arrow keys to navigate between anchors, Tab to exit">
	<svg aria-labelledby="sankey-title" aria-describedby="sankey-desc" width={wrapperStore.data.width} height={wrapperStore.data.height}>
		<title id="sankey-title">Sankey diagram</title>
		<desc id="sankey-desc">Interactive flow diagram - Use arrow keys to navigate between data points, Enter or Space to activate</desc>
		<defs>
			{#each Object.entries(pathsStore.data) as [pathKey]}
				<Gradient key={pathKey} />
			{/each}
		</defs>
		{#each Object.entries(pathsStore.data) as [key, data]}
			<SankeyLine {key} {data} {onPathClick} {onPathMouseEnter} {onPathMouseLeave} />
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
		grid-auto-flow: column;
		/* grid-template-rows: max-content; */
		gap: 0.5rem;
		position: relative;
		justify-content: space-between;
	}
	svg {
		position: absolute;
	}
</style>
