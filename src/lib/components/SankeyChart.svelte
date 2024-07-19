<svelte:options customElement="svsankey-chart" />

<script lang="ts">
  import Anchor from "./Anchor.svelte";
  import AnchorContent from "./AnchorContent.svelte";
  import { ColumnContent, ColumnHeader, Item, Sankey } from "./index";
  type Props = {
    showheaders: boolean;
    highlightpaths: boolean;
    maxpathheight: number;
    chartdata: any;
  };

  let { showheaders, highlightpaths, maxpathheight, chartdata }: Props =
    $props();
</script>

<Sankey {showheaders} {maxpathheight} {highlightpaths}>
  {#each chartdata.data as data}
    {#if showheaders}
      <ColumnHeader>
        <div
          style="font-size: clamp(1.125rem, 2vw, 1.5rem); font-weight: bold; margin-block: 1rem"
        >
          {data.columnLabel === "root"
            ? data?.rows?.[0].items?.[0]?.label
            : data.columnLabel}
        </div>
      </ColumnHeader>
    {/if}
    <ColumnContent {data}>
      {#each data.rows as row}
        <div class="row-label">{row.rowLabel}</div>
        {#each row.items as item}
          <Item {item} on:itemclick on:anchormouseenter on:anchormouseleave>
            <Anchor {item} />
            <AnchorContent
              on:itemclick
              on:anchormouseenter
              on:anchormouseleave
              {item}
              {highlightpaths}
            >
              <div>{item.label}</div>
            </AnchorContent>
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
</style>
