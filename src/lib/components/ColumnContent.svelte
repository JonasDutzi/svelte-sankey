<svelte:options customElement="svsankey-column-content" />

<script lang="ts">
	import type { SankeyColumn } from "../types";
	import { dataStore } from "../stores/data.svelte";

	type Props = {
		data: SankeyColumn;
	};

	let { data }: Props = $props();

	$effect(() => {
		dataStore.addColumn(data);
		return () => {
			dataStore.removeColumn(data);
		};
	});
</script>

<div class="sv-sankey__column-content">
	<slot />
</div>
