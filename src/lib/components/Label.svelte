<svelte:options customElement="svsankey-label" />

<script lang="ts">
	type Props = {
		label: string;
	};
	let { label }: Props = $props();
</script>

<div class="sv-sankey__label">
	<p>{label}</p>
</div>

<style>
	.sv-sankey__label {
		margin-inline: 0.5rem;
		position: relative;
	}
</style>
