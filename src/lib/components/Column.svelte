<div class="sv-sankey__column-wrapper">
	{#if $$slots.label}
		<slot name="label" />
	{/if}
	<slot />
</div>

<style>
	.sv-sankey__column-wrapper {
		outline: 2px solid green;
		padding: 10px;
	}
</style>
