<script lang="ts">
	import "./index.css";
	import { sankeyData as data } from "../../src/testdata/data.customdata.ts";

	import SankeyChart from "../../src/lib/components/SankeyChart.svelte";
	import type { OnItemClick } from "../../src/lib/index.ts";

	const onItemClick: OnItemClick = (item) => {
		messages.push(JSON.stringify(item));
	};

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

	let highlightPaths = $state(true);
	let showHeaders = $state(true);
	let size = $state(50);
</script>

<main>
	<SankeyChart highlightpaths={highlightPaths} showheaders={showHeaders} maxpathheight={size} minpathheight={1} chartdata={data} {onItemClick} />
	<div>
		<ul>
			{#each messages as message}
				<li>{message}</li>{/each}
		</ul>
	</div>
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
</style>
