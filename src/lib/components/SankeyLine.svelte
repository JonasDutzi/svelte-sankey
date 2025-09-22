<svelte:options customElement="svsankey-path" />

<script lang="ts">
	import type { Path } from "../stores/paths.svelte.ts";
	import { Axis, type OnPathClick, type OnPathMouseEnter, type OnPathMouseLeave } from "../types";
	import { linksStore } from "../stores/links.svelte.ts";
	import { scaleValue } from "../helper";
	import { sankeyStore } from "../stores/sankey.svelte.ts";
	import { itemsStore } from "../stores/items.svelte.ts";
	import { tabIndexStore } from "../stores/tabIndex.svelte.ts";
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

	const getPathWidth = () => {
		let pathValue = 0;
		if (linkData.value === 0) {
			return 1;
		} else if (linkData.value > sankeyStore.value.minPathHeight) {
			pathValue = linkData.value;
		} else {
			pathValue = sankeyStore.value.minPathHeight;
		}
		return scaleValue(pathValue, [sankeyStore.value.minPathHeight, sankeyStore.value.maxPathHeight], sankeyStore.value.minValue, sankeyStore.value.maxValue);
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
		const source = itemsStore.value[sourceKey];
		return source;
	});

	let targetData = $derived.by(() => {
		const [_, targetKey] = key.split("/");
		const target = itemsStore.value[targetKey];
		return target;
	});

	let tabIndex = $derived(tabIndexStore.value.paths[key]);

	const linkData = $derived(linksStore.value[key]);

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

	const onPathFocusOut = () => {
		visualPathElement?.classList.remove("focused-path");
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

<path
	bind:this={pathElement}
	role="button"
	tabindex={tabIndex}
	aria-label={pathLabel}
	onkeypress={onPathClicked}
	class="sv-sankey__path-interactive"
	d={bezierCurve}
	style:--path-width-threshold={pathWidthIncreased}
	onclick={onPathClicked}
	onfocus={onPathFocused}
	onfocusout={onPathFocusOut}
	onmouseenter={onPathMouseEntered}
	onmouseleave={onPathMouseLeft}
/>

<path
	bind:this={visualPathElement}
	role="presentation"
	class="sv-sankey__path"
	data-sankey-key={key}
	data-sankey-source="path-{key.split('/')[0]}"
	data-sankey-target="path-{key.split('/')[1]}"
	d={bezierCurve}
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
		cursor: pointer;
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
		cursor: pointer;
		outline: none;
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
