<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
  import type { SankeyColumn } from "../types";
  import { dataStore } from "../stores/data.svelte";

  type Props = {
    data: SankeyColumn;
    children?: () => {};
  };

  let { data, children }: Props = $props();

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
