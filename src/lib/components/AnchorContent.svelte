<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
	import { type Snippet } from "svelte";
	import type { OnItemClick, OnAnchorMouseEnter, OnAnchorMouseLeave, SankeyItem } from "../types";
	import { sankeyStore } from "../stores/sankey.svelte.ts";
	import { dispatchCustomEvent } from "../helper.ts";

	type Props = {
		item: SankeyItem;
		highlightpaths?: boolean;
		children?: Snippet;
		onAnchorMouseEnter?: OnAnchorMouseEnter;
		onAnchorMouseLeave?: OnAnchorMouseLeave;
		onItemClick?: OnItemClick;
	};

	let { item, highlightpaths, onItemClick, onAnchorMouseEnter, onAnchorMouseLeave, children }: Props = $props();

	let hostElement: HTMLElement | undefined = $state(undefined);

	let isPathHighlightingOn = $derived.by(() => {
		if (sankeyStore.value.highlightPaths === false) {
			return false;
		} else {
			return highlightpaths;
		}
	});

	const onClick = () => {
		dispatchCustomEvent(hostElement, onItemClick, "itemclick", item);
	};

	const onMouseEnter = () => {
		if (isPathHighlightingOn) {
			highlightSankeyPaths();
		}
		dispatchCustomEvent(hostElement, onAnchorMouseEnter, "anchormouseenter", item);
	};

	const onMouseLeave = () => {
		if (isPathHighlightingOn) {
			removeSankeyPathsHighlight();
		}
		dispatchCustomEvent(hostElement, onAnchorMouseLeave, "anchormouseleave", item);
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

<button bind:this={hostElement} class="sv-sankey__anchorcontent" onclick={onClick} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
	<slot />
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
