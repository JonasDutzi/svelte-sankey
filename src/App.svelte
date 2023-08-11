<script lang="ts">
    import Sankey from "./lib/components/Sankey.svelte";
    import { sankeyData } from "./lib/testdata/data.bigger";
    import { ColumnHeader, ColumnContent, Item, Link } from "./lib/components";
</script>

<main>
    <div>Svelte Sankey</div>
    <div>
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
        <!-- <SankeyInspector /> -->
    </div>
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
</style>
