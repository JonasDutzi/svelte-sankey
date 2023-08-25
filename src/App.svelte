<script lang="ts">
    import { sankeyData } from "./testdata/data.bigger.ts";
    //import { sankeyData as sankeyData2 } from "./testdata/data.ts";
    import { ColumnContent, ColumnHeader, Item, Link, Sankey } from "./lib/index";
</script>

<main>
    <!-- <div class="mt">Svelte Sankey 1</div> -->
    <Sankey showHeaders maxBoxHeight={50}>
        {#each sankeyData.data as data}
            <ColumnHeader>
                <div style="font-size: clamp(1.125rem, 2vw, 1.5rem); font-weight: bold; margin-block: 1rem">
                    {data.columnLabel === "root" ? data?.rows?.[0].items?.[0]?.label : data.columnLabel}
                </div>
            </ColumnHeader>
        {/each}
        {#each sankeyData.data as data}
            <ColumnContent {data}>
                {#each data.rows as row}
                    <div class="row-label">{row.rowLabel}</div>
                    {#each row.items as item}
                        <Item {item} />
                    {/each}
                {/each}
            </ColumnContent>
        {/each}
        {#each sankeyData.links as data}
            <Link {data} />
        {/each}
    </Sankey>
    <!-- <div class="mt">Svelte Sankey 2</div>
    <SankeyChart showheaders={true} maxboxheight={40} chartdata={sankeyData2} /> -->
    <!-- <div class="mt">Svelte Sankey 3</div>
    <svsankey-chart showheaders={true} maxboxheight={40} chartdata={sankeyData} /> -->

    <!-- <SankeyChart showheaders={true} maxboxheight={40} chartdata={sankeyData2} /> -->
</main>

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
    .mt {
        margin-block: 2rem;
    }
</style>
