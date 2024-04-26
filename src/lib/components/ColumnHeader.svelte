<svelte:options customElement="svsankey-column-header" />

<script lang="ts">
  type Props = {
    children?: () => {};
  };
  let { children }: Props = $props();
</script>

<div class="sv-sankey__column-header">
  <slot />
</div>

<style>
  :global(.sv-sankey__column-header) {
    grid-row: 1;
  }
</style>
