<svelte:options customElement="svsankey-chart" />

<script lang="ts">
  import type { SankeyItem } from "../types";
  import Anchor from "./Anchor.svelte";
  import AnchorContent from "./AnchorContent.svelte";
  import { ColumnContent, ColumnHeader, Item, Sankey } from "./index";
  type Props = {
    showheaders?: boolean;
    highlightpaths?: boolean;
    maxpathheight?: number;
    minpathheight?: number;
    chartdata: any;
    onItemClick?: (item: SankeyItem) => void;
    onAnchorMouseEnter?: (item: SankeyItem) => void;
    onAnchorMouseLeave?: (item: SankeyItem) => void;
  };

  let {
    showheaders = true,
    highlightpaths = true,
    maxpathheight = 32,
    minpathheight = 1,
    onItemClick,
    onAnchorMouseEnter,
    onAnchorMouseLeave,
    chartdata,
  }: Props = $props();
</script>

<Sankey
  {showheaders}
  {maxpathheight}
  {minpathheight}
  {highlightpaths}
  on:pathclick
  on:pathmouseenter
  on:pathmouseleave
>
  {#each chartdata.data as data, columnIndex}
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
            <div
              class="anchor-group"
              style:--anchor-position={columnIndex === chartdata.data.length - 1
                ? "row-reverse"
                : "row"}
            >
              <Anchor {item} />
              <AnchorContent
                {onItemClick}
                {onAnchorMouseEnter}
                {onAnchorMouseLeave}
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
