<svelte:options customElement="svsankey-chart" />

<script lang="ts">
    import { ColumnContent, ColumnHeader, Item, Link, Sankey } from "./index";
    export let showheaders = true;
    export let maxpathheight = 50;
    export let chartdata;
</script>

<Sankey {showheaders} {maxpathheight}>
    {#each chartdata.data as data}
        <ColumnHeader>
            <div style="font-size: clamp(1.125rem, 2vw, 1.5rem); font-weight: bold; margin-block: 1rem">
                {data.columnLabel === "root" ? data?.rows?.[0].items?.[0]?.label : data.columnLabel}
            </div>
        </ColumnHeader>
    {/each}
    {#each chartdata.data as data}
        <ColumnContent {data}>
            {#each data.rows as row}
                <div class="row-label">{row.rowLabel}</div>
                {#each row.items as item}
                    <Item {item} on:itemclick />
                {/each}
            {/each}
        </ColumnContent>
    {/each}
    {#each chartdata.links as data}
        <Link {data} />
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
