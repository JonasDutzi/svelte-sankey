<script lang="ts">
	import { anchorsStore } from "../lib/stores/anchors.svelte.ts";
	import { dataStore } from "../lib/stores/data.svelte.ts";
	import { itemsStore } from "../lib/stores/items.svelte.ts";
	import { linksStore } from "../lib/stores/links.svelte.ts";
	import { pathsStore } from "../lib/stores/paths.svelte.ts";
	import { sankeyStore } from "../lib/stores/sankey.svelte.ts";
	import { wrapperStore } from "../lib/stores/wrapper.svelte.ts";
	import StoreInspector from "./StoreInspector.svelte";

	type Props = {
		size: number;
		showHeaders: boolean;
		highlightPaths: boolean;
		showStores: boolean;
		showSettings: boolean;
	};

	//FIXME: enable eslint
	// eslint-disable-next-line
	let stores = $state<any>([]);

	$effect(() => {
		stores = [
			{ store: linksStore.data, name: "Links", iterable: false },
			{ store: dataStore.data, name: "Data", iterable: false },
			{ store: itemsStore.data, name: "Items", iterable: false },
			{ store: anchorsStore.data, name: "Anchors", iterable: false },
			{ store: pathsStore.data, name: "Paths", iterable: false },
			{ store: wrapperStore.data, name: "Wrapper", iterable: false },
			{ store: sankeyStore.data, name: "Sankey", iterable: false }
		];
	});

	let { size = $bindable(), showHeaders = $bindable(), highlightPaths = $bindable(), showStores = $bindable(), showSettings = $bindable() }: Props = $props();
</script>

<div class="inspector">
	<b>Sankey Inspector:</b>
	{#if showSettings}
		<p style="margin-bottom: 1rem;">Settings/Props:</p>
		<div style="display: flex; align-items: center; gap: 2rem">
			<div>
				<div>Size (maxpathheight):</div>
				<input type="range" min="1" max="400" bind:value={size} />
			</div>
			<div>
				<div>Headers (showheaders):</div>
				<input type="checkbox" bind:checked={showHeaders} />
			</div>
			<div>
				<div>Highlight Paths (highlightpaths):</div>
				<input type="checkbox" bind:checked={highlightPaths} />
			</div>
			<div style="margin-bottom: 2rem;"></div>
		</div>
		<div style="margin-bottom: 3rem;">__________________________________________________</div>
	{/if}
	{#if showStores}
		<div class="stores">
			{#each stores as { store, name, iterable }}
				<div class="store-name"><b>{name}</b></div>
				<StoreInspector {store} {iterable} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.inspector {
		margin-top: 1rem;
	}
	.stores {
		margin: 2rem;
	}
	.store-name {
		margin-block: 1rem;
	}
</style>
