<svelte:options customElement="svsankey-path" />

<script lang="ts">
	import type { Path } from "../stores/paths.svelte.ts";
	import { Axis, type OnPathClick, type OnPathMouseEnter, type OnPathMouseLeave, type SankeyKey } from "../types";
	import { linksStore } from "../stores/links.svelte.ts";
	import { scaleValue } from "../helper";
	import { sankeyStore } from "../stores/sankey.svelte.ts";
	import { itemsStore } from "../stores/items.svelte.ts";
	import { keyboardNavStore } from "../stores/keyboardNavigation.svelte.ts";
	const FIX_NO_BOX_HEIGHT = 0.0001;

	type Props = {
		key: string;
		data: Path;
		onPathClick?: OnPathClick;
		onPathMouseEnter?: OnPathMouseEnter;
		onPathMouseLeave?: OnPathMouseLeave;
	};
	let { key, data, onPathClick, onPathMouseEnter, onPathMouseLeave }: Props = $props();

	let pathElement = $state<SVGPathElement | undefined>();
	let visualPathElement = $state<SVGPathElement | undefined>();

	let pathLabel = $derived.by(() => {
		if (linkData.ariaLabel) {
			return linkData.ariaLabel;
		}
		return `Data stream from ${sourceData.label} to ${targetData.label} with value ${sourceData.totalValues.targets}`;
	});

	// Compute tabindex based on whether this path is currently focused and interactive
	let tabIndex = $derived.by(() => {
		// If no click handler, this path is not interactive
		if (!onPathClick) {
			return -1;
		}
		// Check if this path is the currently focused item
		return keyboardNavStore.focusedItemId === key ? 0 : -1;
	});

	// Determine if this path is interactive
	let isInteractive = $derived(!!onPathClick);

	const getPathWidth = () => {
		let pathValue = 0;
		if (linkData.value === 0) {
			return 1;
		} else if (linkData.value > sankeyStore.data.minPathHeight) {
			pathValue = linkData.value;
		} else {
			pathValue = sankeyStore.data.minPathHeight;
		}
		return scaleValue(pathValue, [sankeyStore.data.minPathHeight, sankeyStore.data.maxPathHeight], sankeyStore.data.minValue, sankeyStore.data.maxValue);
	};
	let pathWidth = $derived(getPathWidth());
	let pathWidthIncreased = $derived.by(() => {
		if (pathWidth <= 30) {
			return 30;
		} else {
			return pathWidth;
		}
	});

	let x1 = $derived.by(() => {
		const value = getPosition(data.sourcePosition.x, pathWidth ?? 0, Axis.x);
		return value + FIX_NO_BOX_HEIGHT;
	});
	let y1 = $derived.by(() => {
		const value = getPosition(data.sourcePosition.y, pathWidth ?? 0, Axis.y);
		return value + FIX_NO_BOX_HEIGHT;
	});
	let x2 = $derived.by(() => getPosition(data.targetPosition.x, pathWidth ?? 0, Axis.x));
	let y2 = $derived.by(() => getPosition(data.targetPosition.y, pathWidth ?? 0, Axis.y));
	let bezierCurve = $derived.by(() => bezierCurveTo(x1, y1, x2, y2));

	let sourceAndTargetData = $derived.by(() => {
		return { source: sourceData, target: targetData };
	});

	let sourceData = $derived.by(() => {
		const [sourceKey, _] = key.split("/");
		const source = itemsStore.data[sourceKey];
		return source;
	});

	let targetData = $derived.by(() => {
		const [_, targetKey] = key.split("/");
		const target = itemsStore.data[targetKey];
		return target;
	});

	const linkData = $derived(linksStore.data[key]);

	const getPosition = (value: number | undefined, pathWidth: number, axis: Axis): number => {
		if (axis === Axis.x && value) {
			return value;
		}
		if (axis === Axis.y && value) {
			return value + pathWidth / 2;
		}
		return 0;
	};

	const bezierCurveTo = (x1: number, y1: number, x2: number, y2: number): string => {
		const xMove = 2;
		const xFactor = (x1 + x2) * (1 / xMove);
		return `M${x1},${y1} C${xFactor},${y1} ${xFactor},${y2}  ${x2},${y2}`;
	};

	const onPathClicked = () => {
		onPathClick?.(sourceAndTargetData);
	};

	const onPathMouseEntered = () => {
		onPathMouseEnter?.(sourceAndTargetData);
	};

	const onPathMouseLeft = () => {
		onPathMouseLeave?.(sourceAndTargetData);
	};

	const onPathFocused = () => {
		visualPathElement?.classList.add("focused-path");
	};

	const onPathItemFocused = () => {
		// Set this path as the currently focused item in the navigation store
		keyboardNavStore.setFocusedItem(key);
		onPathFocused();
	};

	const onPathFocusOut = () => {
		visualPathElement?.classList.remove("focused-path");
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
			onPathClicked();
		}
	};

	const navigateWithKeys = (key: string) => {
		let targetItemId: SankeyKey | null = null;

		switch (key) {
			case "ArrowUp":
				targetItemId = keyboardNavStore.navigateVertical("up");
				break;
			case "ArrowDown":
				targetItemId = keyboardNavStore.navigateVertical("down");
				break;
			case "ArrowLeft":
				targetItemId = keyboardNavStore.navigateHorizontal("left");
				break;
			case "ArrowRight":
				targetItemId = keyboardNavStore.navigateHorizontal("right");
				break;
		}

		if (targetItemId) {
			focusItemById(String(targetItemId));
		}
	};

	const focusItemById = (itemId: string) => {
		// Find and focus the element with the target item ID (could be anchor or path)
		const targetElement = document.querySelector(`[data-item-id="${itemId}"]`) as HTMLButtonElement | SVGPathElement;
		if (targetElement) {
			targetElement.focus();
		}
	};

	const onPathThresholdMouseEnter = () => {
		const paths: any = document.querySelectorAll(`[data-sankey-key='${key}']`);
		paths.forEach((path: any) => {
			path.style.strokeWidth = (pathWidth * 1.5).toString();
		});
	};

	const onPathThresholdMouseLeave = () => {
		const paths: any = document.querySelectorAll(`[data-sankey-key='${key}']`);
		paths.forEach((path: any) => {
			path.style.strokeWidth = pathWidth.toString();
		});
	};
</script>

{#if isInteractive}
	<path
		bind:this={pathElement}
		role="button"
		tabindex={tabIndex}
		aria-label={pathLabel}
		data-item-id={key}
		onkeydown={onKeyDown}
		class="sv-sankey__path-interactive"
		d={bezierCurve}
		style:--path-width-threshold={pathWidthIncreased}
		onclick={onPathClicked}
		onfocus={onPathItemFocused}
		onfocusout={onPathFocusOut}
		onmouseenter={onPathMouseEntered}
		onmouseleave={onPathMouseLeft}
	/>
{:else}
	<path
		bind:this={pathElement}
		role="none"
		class="sv-sankey__path-interactive"
		d={bezierCurve}
		style:--path-width-threshold={pathWidthIncreased}
		onmouseenter={onPathMouseEntered}
		onmouseleave={onPathMouseLeft}
	/>
{/if}

<path
	bind:this={visualPathElement}
	role="presentation"
	class="sv-sankey__path"
	data-sankey-key={key}
	data-sankey-source="path-{key.split('/')[0]}"
	data-sankey-target="path-{key.split('/')[1]}"
	d={bezierCurve}
	style:--cursor-type={isInteractive ? "pointer" : "default"}
	style:--path-width={pathWidth}
	style:--path-width-increased={pathWidth * 1.05}
	style:--stroke-color={data.strokeColor}
	style:--stroke-color-hover={data.strokeColorHover}
	style="stroke: url(#sv-sankey__gradient-{key});"
/>

<style>
	:global(.sv-sankey__path) {
		/* stroke: var(--stroke-color, rgba(44, 61, 171, 0.3)); */
		stroke-width: var(--path-width);
		fill: none;
		cursor: var(--cursor-type, default);
	}
	:global(.sv-sankey__path:hover),
	:global(.sv-sankey__path:focus) {
		filter: brightness(0.6);
		/* animation: increase-stroke ease-in-out 0.3s forwards; */
	}

	:global(.focused-path) {
		filter: brightness(0.8);
		/* animation: increase-stroke ease-in-out 0.3s forwards; */
	}

	:global(.sv-sankey__path-interactive) {
		stroke: rgba(0, 0, 0, 0);
		stroke-width: var(--path-width-threshold);
		fill: none;
		outline: none;
	}

	:global(.sv-sankey__path-interactive[role="button"]) {
		cursor: pointer;
	}

	:global(.sv-sankey__path-interactive[role="none"]) {
		cursor: default;
	}
	@keyframes increase-stroke {
		from {
			stroke-width: var(--path-width);
		}
		to {
			stroke-width: var(--path-width-increased);
		}
	}
</style>
