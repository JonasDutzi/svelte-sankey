<script lang="ts">
	import Anchor from "../lib/components/Anchor.svelte";
	import AnchorContent from "../lib/components/AnchorContent.svelte";
	import { ColumnContent, Item, Sankey } from "../lib/components/index";
	export let highlightpaths = true;
	export let maxpathheight = 50;
	export let chartdata;
</script>

<Sankey {maxpathheight} {highlightpaths}>
	{#each chartdata.data as data}
		<ColumnContent {data}>
			{#each data.rows as row}
				<div class="row-label">{row.rowLabel}</div>
				{#each row.items as item}
					<Item {item} on:itemclick on:anchormouseenter on:anchormouseleave>
						<Anchor {item} />
						<AnchorContent on:itemclick on:anchormouseenter on:anchormouseleave {item}>
							<div>{item.label}: {item.data.totalValue} kilogram</div>
						</AnchorContent>
					</Item>
				{/each}
			{/each}
		</ColumnContent>
	{/each}
</Sankey>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.row-label {
		font-weight: 700;
		font-size: 1.025rem;
	}
</style>
