<svelte:options customElement="svsankey-anchorcontent" />

<script lang="ts">
	import { type Snippet } from "svelte";
	import type { OnItemClick, OnAnchorMouseEnter, OnAnchorMouseLeave, SankeyItem, SankeyKey } from "../types";
	import { sankeyStore } from "../stores/sankey.svelte.ts";
	import { navigationStore } from "../stores/navigation.svelte.ts";
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

	let hostElement: HTMLElement | undefined;

	let isPathHighlightingOn = $derived.by(() => {
		if (sankeyStore.data.highlightPaths === false) {
			return false;
		} else {
			return highlightpaths;
		}
	});

	// Compute tabindex based on whether this item is currently focused
	let tabIndex = $derived.by(() => {
		// If no item is focused yet, make the first item focusable
		if (navigationStore.value.focusedItemId === null) {
			const firstItemId = navigationStore.getFirstFocusableItemId();
			return firstItemId === item.id ? 0 : -1;
		}
		// Otherwise, only the currently focused item should be in the tab sequence
		return navigationStore.value.focusedItemId === item.id ? 0 : -1;
	});

	const onClick = () => {
		dispatchCustomEvent(hostElement, onItemClick, "itemclick", item);
	};

	const onFocus = () => {
		// Set this item as the currently focused item in the navigation store
		navigationStore.setFocusedItem(item.id);
	};

	// Initialize focus if this is the first item and no focus is set
	$effect(() => {
		if (navigationStore.value.focusedItemId === null) {
			const firstItemId = navigationStore.getFirstFocusableItemId();
			if (firstItemId === item.id) {
				// This is the first item, initialize focus
				navigationStore.initializeFocus();
			}
		}
	});

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

	const onKeyDown = (event: KeyboardEvent) => {
		// Handle arrow key navigation
		if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
			event.preventDefault();
			navigateWithKeys(event.key);
		}
		// Handle Enter/Space for activation
		else if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onClick();
		}
	};

	const navigateWithKeys = (key: string) => {
		let targetItemId: SankeyKey | null = null;

		switch (key) {
			case "ArrowUp":
				targetItemId = navigationStore.navigateVertical("up");
				break;
			case "ArrowDown":
				targetItemId = navigationStore.navigateVertical("down");
				break;
			case "ArrowLeft":
				targetItemId = navigationStore.navigateHorizontal("left");
				break;
			case "ArrowRight":
				targetItemId = navigationStore.navigateHorizontal("right");
				break;
		}

		if (targetItemId) {
			focusItemById(String(targetItemId));
		}
	};
	const focusItemById = (itemId: string) => {
		// Find and focus the anchor element with the target item ID
		const targetElement = document.querySelector(`[data-item-id="${itemId}"]`) as HTMLButtonElement;
		if (targetElement) {
			targetElement.focus();
		}
	};
</script>

<button
	bind:this={hostElement}
	class="sv-sankey__anchorcontent"
	tabindex={tabIndex}
	aria-label="Sankey anchor: {item.label}"
	data-item-id={item.id}
	onclick={onClick}
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
	onfocus={onFocus}
	onkeydown={onKeyDown}
>
	<slot />
</button>

<style>
	:host {
		cursor: pointer;
		background-color: rgba(255, 255, 255);
		border: 1px solid rgba(239, 239, 239, 0.2);
		border-radius: 5px;
		z-index: 1;
		margin-inline: 0.75rem;
		padding-inline: 1rem;
	}
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

	:global(.sv-sankey__anchorcontent:focus) {
		background-color: rgb(180, 180, 255);
		outline: 2px solid rgb(0, 95, 204);
		outline-offset: 2px;
	}

	:global(.sv-sankey__anchorcontent:focus-visible) {
		background-color: rgb(180, 180, 255);
		outline: 2px solid rgb(0, 95, 204);
		outline-offset: 2px;
	}
</style>
