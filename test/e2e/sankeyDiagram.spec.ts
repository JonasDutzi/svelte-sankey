import { test, expect } from "./base";

test("render sankey diagram", async ({ page, axe }) => {
	await page.goto("http://localhost:5173/test/e2e/tests.html");
	const axeResults = await axe().analyze();
	expect(axeResults.violations).toEqual([]);
	await expect(page.getByRole("button", { name: "Sankey anchor: Flour" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sankey anchor: Biscuit" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sankey anchor: Chocolate Production" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sankey anchor: Semi-finished" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sankey anchor: Strawberry Cake" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Sankey anchor: Chocolate Cake" })).toBeVisible();
	await page.getByRole("button", { name: "Sankey anchor: Chocolate Cake" }).click();
	await expect(page.getByRole("listitem")).toContainText('{"id":"chococake","label":"Chocolate Cake","data":{"totalValue":8},"anchorColor":"var(--anchor-color-6)"}');
});
