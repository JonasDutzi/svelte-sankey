<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
	import { type Snippet } from "svelte";
	import type { OnItemClick, OnAnchorMouseEnter, OnAnchorMouseLeave, SankeyItem } from "../types";
	import { sankeyStore } from "../stores/sankey.svelte.ts";
	import Children from "./Children.svelte";

	type Props = {
		item: SankeyItem;
		highlightpaths?: boolean;
		children?: Snippet;
		itemclick?: OnItemClick;
		onAnchorMouseEnter?: OnAnchorMouseEnter;
		onAnchorMouseLeave?: OnAnchorMouseLeave;
	};

	let { item, highlightpaths, itemclick, onAnchorMouseEnter, onAnchorMouseLeave, children }: Props = $props();

	let isPathHighlightingOn = $derived.by(() => {
		if (sankeyStore.value.highlightPaths === false) {
			return false;
		} else {
			return highlightpaths;
		}
	});

	const onClick = () => {
		itemclick?.(item);
	};

	const onMouseEnter = () => {
		if (isPathHighlightingOn) {
			highlightSankeyPaths();
		}
		onAnchorMouseEnter?.(item);
	};

	const onMouseLeave = () => {
		if (isPathHighlightingOn) {
			removeSankeyPathsHighlight();
		}
		onAnchorMouseLeave?.(item);
	};

	const highlightSankeyPaths = () => {
		let paths = [...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`), ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`)];
		paths.forEach((path) => {
			window.requestAnimationFrame(() => {
				(path as unknown as SVGPathElement).classList.add("focused-path");
			});
		});
	};

	const removeSankeyPathsHighlight = () => {
		let paths = [...document.querySelectorAll(`[data-sankey-source=path-${item.id}]`), ...document.querySelectorAll(`[data-sankey-target=path-${item.id}]`)];
		paths.forEach((path) => {
			window.requestAnimationFrame(() => {
				(path as unknown as SVGPathElement).classList.remove("focused-path");
			});
		});
	};
</script>

<button class="sv-sankey__anchorcontent" onclick={onClick} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
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
	}

	:global(.sv-sankey__anchorcontent:hover) {
		background-color: rgb(208, 208, 208);
	}
</style>
