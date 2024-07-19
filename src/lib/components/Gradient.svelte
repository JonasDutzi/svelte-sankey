<script lang="ts">
  import { anchorsStore } from "../stores/anchors.svelte";

  type Props = {
    key: string;
  };

  let { key }: Props = $props();

  const sourceAnchorColor = $derived.by(() => {
    const source = key.split("/")[0];
    return anchorsStore.value[source].anchorColor;
  });
  const targetAnchorColor = $derived.by(() => {
    const target = key.split("/")[1];
    return anchorsStore.value[target].anchorColor;
  });
</script>

<linearGradient id="sv-sankey__gradient-{key}" data-sankey-key={key}>
  <stop offset="0%" stop-color={sourceAnchorColor}></stop>
  <stop offset="100%" stop-color={targetAnchorColor}></stop>
</linearGradient>
