<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
  import type { SankeyColumn } from "../types";
  import { dataStore } from "../stores/data.svelte";

  let { data, children } = $props<{
    data: SankeyColumn;
    children?: () => {};
  }>();

  $effect(() => {
    dataStore.addColumn(data);
    () => {
      dataStore.removeColumn(data);
    };
  });
</script>

<div class="sv-sankey__column-content">
  <slot />
</div>

<style>
  :global(.sv-sankey__column-content) {
  }
</style>
