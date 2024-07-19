import type { SankeyData } from "../lib/index";

export const sankeyData: SankeyData = {
  data: [
    {
      id: "left",
      columnLabel: "Raw Materials",
      rows: [
        {
          rowLabel: "Category 1",
          items: [
            {
              id: "input1",
              label: "Input 1",
              links: [
                {
                  target: "semifinished1",
                  value: 5,
                },
              ],
            },
            {
              id: "input2",
              label: "Input 2",
              links: [
                {
                  target: "semifinished1",
                  value: -10,
                },
              ],
            },
            {
              id: "input3",
              label: "Input 3",
              links: [
                {
                  target: "semifinished1",
                  value: -10,
                },
              ],
            },
            {
              id: "input4",
              label: "Input 4",
              links: [
                {
                  target: "semifinished1",
                  value: -10,
                },
              ],
            },
            {
              id: "input5",
              label: "Input 5",
              links: [
                {
                  target: "semifinished1",
                  value: 5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "middle",
      columnLabel: "Semi-finished Goods",
      rows: [
        {
          rowLabel: "Category 1",
          items: [
            {
              id: "semifinished1",
              label: "Semi-finished good 1",
              links: [
                {
                  target: "finished1",
                  value: 10,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "right",
      columnLabel: "Products",
      rows: [
        {
          rowLabel: "Product",
          items: [{ id: "finished1", label: "Finished good 1" }],
        },
      ],
    },
  ],
};
