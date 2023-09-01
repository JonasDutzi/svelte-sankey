<svelte:options customElement="svsankey-link" />

<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { SankeyLink } from "../types";
    import { logError } from "../helper";
    import { linksStore } from "../stores/links";
    import { sankeyStore } from "../stores/sankey";

    export let data: SankeyLink;

    onMount(() => {
        if (!data.source || !data.target) {
            logError(`Sankey Link must have a source and a target - source: "${data.source}" target: "${data.target}"`);
        }
        linksStore.add(data);

        if (data.value && data.value > $sankeyStore.maxValue) {
            $sankeyStore.maxValue = data.value;
        }

        if (data.value && $sankeyStore.minValue) {
            if ($sankeyStore.minValue > data.value) {
                $sankeyStore.minValue = data.value;
            }
        } else {
            $sankeyStore.minValue = data.value;
        }
    });

    onDestroy(() => {
        linksStore.remove(data);
    });
</script>
