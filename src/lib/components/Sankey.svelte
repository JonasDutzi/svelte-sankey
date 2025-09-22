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
		showheaders?: boolean;
		highlightpaths?: boolean;
		maxpathheight?: number;
		minpathheight?: number;
		onPathClick?: OnPathClick;
		onPathMouseEnter?: OnPathMouseEnter;
		onPathMouseLeave?: OnPathMouseLeave;
		children?: Snippet;
	};

	let { showheaders = true, highlightpaths = true, maxpathheight = 32, minpathheight = 1, onPathClick, onPathMouseEnter, onPathMouseLeave, children }: Props = $props();

	let wrapperRef = $state<HTMLDivElement | undefined>();

	$effect(() => {
		sankeyStore.setHighlightPaths(highlightpaths);
	});

	$effect(() => {
		sankeyStore.setMaxPathHeight(maxpathheight);
	});

	$effect(() => {
		sankeyStore.setMinPathHeight(minpathheight);
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

<div bind:this={wrapperRef} style:--grid-auto-flow={showheaders ? "row" : "column"} class="sv-sankey__wrapper">
	<svg aria-labelledby="sankey-title" aria-describedby="sankey-desc" width={wrapperStore.value.width} height={wrapperStore.value.height}>
		<title id="sankey-title">Sankey diagram</title>
		<desc id="sankey-desc">Interactive flow diagram with</desc>
		<defs>
			{#each Object.entries(pathsStore.value) as [pathKey]}
				<Gradient key={pathKey} />
			{/each}
		</defs>
		{#each Object.entries(pathsStore.value) as [key, data]}
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
		grid-auto-flow: var(--grid-auto-flow);
		/* grid-template-rows: max-content; */
		gap: 0.5rem;
		position: relative;
		justify-content: space-between;
	}
	svg {
		position: absolute;
	}
</style>
