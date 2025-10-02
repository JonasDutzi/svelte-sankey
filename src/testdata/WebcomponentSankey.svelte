<script lang="ts">
	import { sankeyData } from "./data.customdata";
	import SankeyInspector from "../inspector/Inspector.svelte";
	type Props = {
		minpathheight?: number;
		maxpathheight?: number;
		highlightpaths?: boolean;
	};

	let { maxpathheight = 50, minpathheight = 1, highlightpaths = true }: Props = $props();
</script>

<sv-sankey {highlightpaths} {minpathheight} {maxpathheight} class="custom-chart">
	{#each sankeyData.data as data, columnIndex}
		<svsankey-column-header>
			<div>
				{data.columnLabel === "root" ? data?.rows?.[0].items?.[0]?.label : data.columnLabel}
			</div>
		</svsankey-column-header>
		<svsankey-column-content {data}>
			{#each data.rows as row}
				<div class="row-label">{row.rowLabel}</div>
				{#each row.items as item}
					<svsankey-item {item}>
						<div class="anchor-group" style:--anchor-position={columnIndex === sankeyData.data.length - 1 ? "row-reverse" : "row"}></div>
						<svsankey-anchor {item}> </svsankey-anchor>
						<svsankey-anchorcontent {item}>
							<div>{item.label}</div>
						</svsankey-anchorcontent>
					</svsankey-item>
				{/each}
			{/each}
		</svsankey-column-content>
	{/each}
</sv-sankey>

<SankeyInspector showStores={true} showSettings={true} highlightPaths={true} size={50} />

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
</style>
