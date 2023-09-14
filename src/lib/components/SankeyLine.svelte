<svelte:options customElement="svsankey-path" />

<script lang="ts">
    import type { Path } from "../stores/paths";
    import { Axis } from "../types";
    import { linksStore } from "../stores/links";
    import { scaleValue } from "../helper";
    import { sankeyStore } from "../stores/sankey";

    export let key: string;
    export let data: Path;

    let pathWidth;

    $: {
        const linkData = $linksStore.get(key);
        let pathValue;
        if (linkData?.value! > $sankeyStore.minPathHeight) {
            pathValue = linkData?.value;
        } else {
            pathValue = $sankeyStore.minPathHeight;
        }
        pathWidth = scaleValue(pathValue, [$sankeyStore.minPathHeight, $sankeyStore.maxPathHeight], $sankeyStore.minValue, $sankeyStore.maxValue);
    }

    $: x1 = getPosition(data.sourcePosition.x, pathWidth ?? 0, Axis.x);
    $: y1 = getPosition(data.sourcePosition.y, pathWidth ?? 0, Axis.y);
    $: x2 = getPosition(data.targetPosition.x, pathWidth ?? 0, Axis.x);
    $: y2 = getPosition(data.targetPosition.y, pathWidth ?? 0, Axis.y);

    const getPosition = (value: number | undefined, pathWidth: number, axis: Axis): number => {
        if (axis === Axis.x && value) {
            return value;
        }
        if (axis === Axis.y && value) {
            return value + pathWidth / 2;
        }
        return 0;
    };

    $: bezierCurve = bezierCurveTo(x1, y1, x2, y2);

    const bezierCurveTo = (x1: number, y1: number, x2: number, y2: number): string => {
        const xMove = 2;
        const xFactor = (x1 + x2) * (1 / xMove);
        return `M${x1},${y1} C${xFactor},${y1} ${xFactor},${y2}  ${x2},${y2}`;
    };
</script>

<path
    class="sv-sankey__path"
    data-sankey-source="path-{key.split('/')[0]}"
    data-sankey-target="path-{key.split('/')[1]}"
    d={bezierCurve}
    style:--path-width={pathWidth}
    style:--stroke-color={data.strokeColor}
    style:--stroke-color-hover={data.strokeColorHover}
/>

<style>
    :global(.sv-sankey__path) {
        z-index: -1;
        stroke: var(--stroke-color, rgba(44, 61, 171, 0.3));
        stroke-width: var(--path-width);
        fill: none;
    }
    :global(.sv-sankey__path:hover) {
        stroke: var(--stroke-color-hover, rgba(44, 61, 171, 0.6));
    }
</style>
