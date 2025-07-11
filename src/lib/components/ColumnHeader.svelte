<svelte:options customElement="svsankey-column-header" />

<script lang="ts">
  import type { Snippet } from "svelte";
  import Children from "./Children.svelte";

  type Props = {
    children?: Snippet;
  };
  let { children }: Props = $props();
</script>

<div class="sv-sankey__column-header">
  <Children {children}></Children>
</div>

<style>
  :global(.sv-sankey__column-header) {
    grid-row: 1;
  }
</style>
