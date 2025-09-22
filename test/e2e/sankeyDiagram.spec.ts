import { test, expect } from "./base";

test("render sankey diagram", async ({ page, axe }) => {
	await page.goto("http://localhost:5173/test/e2e/tests.html");
	const axeResults = await axe().analyze();
	expect(axeResults.violations).toEqual([]);
	await expect(page.getByRole("button", { name: "Flour", exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "Biscuit", exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "Chocolate Production", exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "Semi-finished good", exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "Strawberry Cake", exact: true })).toBeVisible();
	const cakeLabel = await page.getByRole("button", { name: "Chocolate Cake", exact: true });
	await expect(cakeLabel).toBeVisible();
	await cakeLabel.click();
	await expect(page.getByRole("listitem")).toContainText('{"id":"chococake","label":"Chocolate Cake","data":{"totalValue":8},"anchorColor":"var(--anchor-color-6)"}');
});
