<svelte:options customElement="svsankey-column-header" />

<script lang="ts">
	import type { Snippet } from "svelte";
</script>

<div class="sv-sankey__column-header">
	<slot />
</div>

<style>
	:host {
		grid-row: 1;
	}
	:global(.sv-sankey__column-header) {
		grid-row: 1;
	}
</style>
