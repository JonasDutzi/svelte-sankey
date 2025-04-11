<script lang="ts">
  import { anchorsStore } from "../stores/anchors.svelte";

  type Props = {
    key: string;
  };

  let { key }: Props = $props();

  const sourceAnchorColor = $derived.by(() => {
    const direction = document.documentElement.dir === "ltr" ? 0 : 1;
    const color = key.split("/")[direction];
    return anchorsStore.value[color].anchorColor;
  });
  const targetAnchorColor = $derived.by(() => {
    const direction = document.documentElement.dir === "ltr" ? 1 : 0;
    const color = key.split("/")[direction];
    return anchorsStore.value[color].anchorColor;
  });
</script>

<linearGradient id="sv-sankey__gradient-{key}" data-sankey-key={key}>
  <stop offset="0%" stop-color={sourceAnchorColor}></stop>
  <stop offset="100%" stop-color={targetAnchorColor}></stop>
</linearGradient>
