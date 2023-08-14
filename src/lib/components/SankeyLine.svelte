<svelte:options customElement="svsankey-line" />

<script lang="ts">
    import type { Path } from "../stores/paths";
    import { Axis } from "../types";
    import { linksStore } from "../stores/index";

    export let key: string;
    export let data: Path;
    export let minPathWidth: number = 1;

    $: pathWidth = calculatePathWidth(key);
    $: x1 = getPosition(data.sourcePosition.x, pathWidth ?? 0, Axis.x);
    $: y1 = getPosition(data.sourcePosition.y, pathWidth ?? 0, Axis.y);
    $: x2 = getPosition(data.targetPosition.x, pathWidth ?? 0, Axis.x);
    $: y2 = getPosition(data.targetPosition.y, pathWidth ?? 0, Axis.y);

    const calculatePathWidth = (pathKey: string) => {
        const linkData = $linksStore.get(pathKey);
        if (linkData?.value! > minPathWidth) {
            return linkData?.value;
        }
        return minPathWidth;
    };

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
        return `M${x1},${y1}, C${xFactor},${y1}, ${xFactor},${y2}  ${x2},${y2}`;
    };
</script>

<path d={bezierCurve} style:--path-width={pathWidth} />

<style>
    path {
        z-index: -1;
        stroke: rgba(44, 61, 171, 0.3);
        stroke-width: var(--path-width);
        fill: none;
    }
    path:hover {
        stroke: rgba(44, 61, 171, 0.6);
    }
</style>
