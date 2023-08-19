<svelte:options customElement="svsankey-link" />

<script>import { onDestroy, onMount } from "svelte";
import { logError } from "../helper";
import { linksStore } from "../stores";
export let data;
onMount(() => {
  if (!data.source || !data.target) {
    logError(`Sankey Link must have a source and a target - source: "${data.source}" target: "${data.target}"`);
  }
  linksStore.add(data);
});
onDestroy(() => {
  linksStore.remove(data);
});
</script>
