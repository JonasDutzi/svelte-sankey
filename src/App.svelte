<script lang="ts">
	import "./index.css";
	import { sankeyData as data } from "./testdata/data.customdata.ts";

	import SankeyInspector from "./inspector/Inspector.svelte";
	import SankeyChart from "./lib/components/SankeyChart.svelte";
	import type { OnAnchorClick, OnAnchorMouseEnter, OnAnchorMouseLeave, OnItemClick, OnPathClick, OnPathMouseEnter, OnPathMouseLeave, SankeyItem } from "./lib/index.ts";
	import WebcomponentSankey from "./testdata/WebcomponentSankey.svelte";

	const onItemClick: OnItemClick = (item) => {
		messages.push(JSON.stringify(item));
	};

	const onAnchorMouseEnter: OnAnchorMouseEnter = () => {};
	const onAnchorMouseLeave: OnAnchorMouseLeave = () => {};

	const onPathClick: OnPathClick = () => {
		console.log("path clicked");
	};
	const onPathMouseEnter: OnPathMouseEnter = ({ source, target }) => {};
	const onPathMouseLeave: OnPathMouseLeave = ({ source, target }) => {};

	//basic example of resizing based on window breakpoints
	$effect(() => {
		window.addEventListener("resize", () => {
			console.log("resized");
			if (window.innerWidth > 1025) {
				return; //use default size
			} else if (window.innerWidth > 768) {
				size = 150;
			} else {
				size = 60;
			}
		});
	});

	let messages = $state<Array<string>>([]);

	let showWebcomponentSankey = $state(false);

	let highlightPaths = $state(true);
	let showHeaders = $state(true);
	let size = $state(50);
</script>

<main>
	{#if showWebcomponentSankey}
		<WebcomponentSankey maxpathheight={size} minpathheight={1} highlightpaths={highlightPaths} showheaders={showHeaders} />
	{:else}
		<SankeyChart
			highlightpaths={highlightPaths}
			showheaders={showHeaders}
			maxpathheight={size}
			minpathheight={1}
			chartdata={data}
			{onItemClick}
			{onAnchorMouseEnter}
			{onAnchorMouseLeave}
			{onPathClick}
			{onPathMouseEnter}
			{onPathMouseLeave}
		/>
		<div>
			<ul>
				{#each messages as message}
					<li>{message}</li>{/each}
			</ul>
		</div>
	{/if}
	<input id="custom" type="checkbox" bind:checked={showWebcomponentSankey} />
	<label for="custom">Show Webcomponent Sankey</label>
	<SankeyInspector showStores={true} showSettings={true} bind:showHeaders bind:size bind:highlightPaths />
</main>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: sans-serif;
	}
	:global(body) {
		background-color: hsl(0, 0%, 93%);
	}
	#custom {
		margin-top: 5rem;
	}
</style>
