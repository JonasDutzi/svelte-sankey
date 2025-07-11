<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
  import type { SankeyColumn } from "../types";
  import { dataStore } from "../stores/data.svelte";
  import type { Snippet } from "svelte";
  import Children from "./Children.svelte";

  type Props = {
    data: SankeyColumn;
    children?: Snippet;
  };

  let { data, children }: Props = $props();

  $effect(() => {
    dataStore.addColumn(data);
    return () => {
      dataStore.removeColumn(data);
    };
  });
</script>

<div class="sv-sankey__column-content">
  <Children {children}></Children>
</div>
