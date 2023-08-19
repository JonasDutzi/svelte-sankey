<svelte:options customElement="svsankey-line" />

<script>import { Axis } from "../types";
import { linksStore } from "../stores/index";
export let key;
export let data;
export let minPathWidth = 1;
$:
  pathWidth = calculatePathWidth(key);
$:
  x1 = getPosition(data.sourcePosition.x, pathWidth ?? 0, Axis.x);
$:
  y1 = getPosition(data.sourcePosition.y, pathWidth ?? 0, Axis.y);
$:
  x2 = getPosition(data.targetPosition.x, pathWidth ?? 0, Axis.x);
$:
  y2 = getPosition(data.targetPosition.y, pathWidth ?? 0, Axis.y);
const calculatePathWidth = (pathKey) => {
  const linkData = $linksStore.get(pathKey);
  if (linkData?.value > minPathWidth) {
    return linkData?.value;
  }
  return minPathWidth;
};
const getPosition = (value, pathWidth2, axis) => {
  if (axis === Axis.x && value) {
    return value;
  }
  if (axis === Axis.y && value) {
    return value + pathWidth2 / 2;
  }
  return 0;
};
$:
  bezierCurve = bezierCurveTo(x1, y1, x2, y2);
const bezierCurveTo = (x12, y12, x22, y22) => {
  const xMove = 2;
  const xFactor = (x12 + x22) * (1 / xMove);
  return `M${x12},${y12} C${xFactor},${y12} ${xFactor},${y22}  ${x22},${y22}`;
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
