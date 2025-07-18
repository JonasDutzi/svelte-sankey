<svelte:options customElement="svsankey-chart" />

<script lang="ts">
	import type { OnAnchorClick, OnAnchorMouseEnter, OnAnchorMouseLeave, OnItemClick, OnPathClick, OnPathMouseEnter, OnPathMouseLeave } from "../types";
	import Anchor from "./Anchor.svelte";
	import AnchorContent from "./AnchorContent.svelte";
	import { ColumnContent, ColumnHeader, Item, Sankey } from "./index";
	import { dispatchCustomEvent } from "../helper.ts";
	type Props = {
		showheaders?: boolean;
		highlightpaths?: boolean;
		maxpathheight?: number;
		minpathheight?: number;
		chartdata: any;
		onItemClick?: OnItemClick;
		onAnchorClick?: OnAnchorClick;
		onAnchorMouseEnter?: OnAnchorMouseEnter;
		onAnchorMouseLeave?: OnAnchorMouseLeave;
		onPathClick?: OnPathClick;
		onPathMouseEnter?: OnPathMouseEnter;
		onPathMouseLeave?: OnPathMouseLeave;
	};

	let {
		showheaders = true,
		highlightpaths = true,
		maxpathheight = 32,
		minpathheight = 1,
		onItemClick,
		onAnchorClick,
		onAnchorMouseEnter,
		onAnchorMouseLeave,
		onPathClick,
		onPathMouseEnter,
		onPathMouseLeave,
		chartdata
	}: Props = $props();

	const forwardEvent = (handler: ((data: any) => void) | undefined, eventName: string, data: any) => {
		dispatchCustomEvent($host(), handler, eventName, data);
	};
</script>

<Sankey {showheaders} {maxpathheight} {minpathheight} {highlightpaths} {onPathClick} {onPathMouseEnter} {onPathMouseLeave}>
	{#each chartdata.data as data, columnIndex}
		{#if showheaders}
			<ColumnHeader>
				<div style="font-size: clamp(1.125rem, 2vw, 1.5rem); font-weight: bold; margin-block: 1rem">
					{data.columnLabel === "root" ? data?.rows?.[0].items?.[0]?.label : data.columnLabel}
				</div>
			</ColumnHeader>
		{/if}
		<ColumnContent {data}>
			{#each data.rows as row}
				<div class="row-label">{row.rowLabel}</div>
				{#each row.items as item}
					<Item {item}>
						<div class="anchor-group" style:--anchor-position={columnIndex === chartdata.data.length - 1 ? "row-reverse" : "row"}>
							<Anchor {item} {onAnchorClick} />
							<AnchorContent
								onItemClick={() => forwardEvent(onItemClick, "itemclick", item)}
								onAnchorMouseEnter={() => forwardEvent(onAnchorMouseEnter, "anchormouseenter", item)}
								onAnchorMouseLeave={() => forwardEvent(onAnchorMouseLeave, "anchormouseleave", item)}
								{item}
								{highlightpaths}
							>
								<div>{item.label}</div>
							</AnchorContent>
						</div>
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
	.anchor-group {
		display: flex;
		flex: 1;
		flex-direction: var(--anchor-position, "row");
	}
</style>
