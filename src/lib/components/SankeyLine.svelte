<svelte:options customElement="svsankey-path" />

<script lang="ts">
  import type { Path } from "../stores/paths.svelte.ts";
  import { Axis } from "../types";
  import { linksStore } from "../stores/links.svelte.ts";
  import { scaleValue } from "../helper";
  import { sankeyStore } from "../stores/sankey.svelte.ts";

  type Props = {
    key: string;
    data: Path;
  };

  const getPosition = (
    value: number | undefined,
    pathWidth: number,
    axis: Axis
  ): number => {
    if (axis === Axis.x && value) {
      return value;
    }
    if (axis === Axis.y && value) {
      return value + pathWidth / 2;
    }
    return 0;
  };

  const getPathWidth = () => {
    const linkData = linksStore.value[key];
    let pathValue = 0;
    if (linkData.value === 0) {
      return 1;
    } else if (linkData?.value! > sankeyStore.value.minPathHeight) {
      pathValue = linkData?.value!;
    } else {
      pathValue = sankeyStore.value.minPathHeight;
    }
    return scaleValue(
      pathValue,
      [sankeyStore.value.minPathHeight, sankeyStore.value.maxPathHeight],
      sankeyStore.value.minValue,
      sankeyStore.value.maxValue
    );
  };

  const bezierCurveTo = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): string => {
    const xMove = 2;
    const xFactor = (x1 + x2) * (1 / xMove);
    return `M${x1},${y1} C${xFactor},${y1} ${xFactor},${y2}  ${x2},${y2}`;
  };

  let { key, data }: Props = $props();
  let pathWidth = $derived(getPathWidth());

  const FIX_NO_BOX_HEIGHT = 0.0001;
  let x1 = $derived.by(() => {
    const value = getPosition(data.sourcePosition.x, pathWidth ?? 0, Axis.x);
    return value + FIX_NO_BOX_HEIGHT;
  });
  let y1 = $derived.by(() => {
    const value = getPosition(data.sourcePosition.y, pathWidth ?? 0, Axis.y);
    return value + FIX_NO_BOX_HEIGHT;
  });
  let x2 = $derived.by(() =>
    getPosition(data.targetPosition.x, pathWidth ?? 0, Axis.x)
  );
  let y2 = $derived.by(() =>
    getPosition(data.targetPosition.y, pathWidth ?? 0, Axis.y)
  );
  let bezierCurve = $derived.by(() => bezierCurveTo(x1, y1, x2, y2));
</script>

<path
  class="sv-sankey__path"
  data-sankey-key={key}
  data-sankey-source="path-{key.split('/')[0]}"
  data-sankey-target="path-{key.split('/')[1]}"
  d={bezierCurve}
  style:--path-width={pathWidth}
  style:--stroke-color={data.strokeColor}
  style:--stroke-color-hover={data.strokeColorHover}
  style="stroke: url(#sv-sankey__gradient-{key});"
/>

<style>
  :global(.sv-sankey__path) {
    z-index: -1;
    /* stroke: var(--stroke-color, rgba(44, 61, 171, 0.3)); */
    stroke-width: var(--path-width);
    fill: none;
    opacity: 0.8;
  }
</style>
