<svelte:options customElement="svsankey-item" />

<script lang="ts">
    import { onMount } from "svelte";
    import Anchor from "./Anchor.svelte";
    import Label from "./Label.svelte";
    import type { SankeyItem } from "../../types";
    import { logError } from "../../helper";

    export let item: SankeyItem;

    onMount(() => {
        if (!item.id) {
            logError("Every Sankey Item must have a key");
        }
    });
</script>

<div class="sv-sankey__item">
    <Anchor id={item.id} />
    <Label label={item.label} />
    <slot />
</div>

<style>
    :global(.sv-sankey__item) {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-direction: row;
        margin-block: 1em;
    }
</style>
