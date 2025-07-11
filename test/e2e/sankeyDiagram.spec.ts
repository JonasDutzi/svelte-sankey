import { test, expect } from "./base";

test("render sankey diagram", async ({ page }) => {
	await page.goto("http://localhost:5173/test/e2e/tests.html");
	await expect(page.getByRole("button", { name: "Flour" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Biscuit" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Chocolate Production" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Semi-finished good" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Strawberry Cake" })).toBeVisible();
	const cakeLabel = await page.getByRole("button", { name: "Chocolate Cake" });
	await expect(cakeLabel).toBeVisible();
	await cakeLabel.click();
	await expect(page.getByRole("listitem")).toContainText('{"id":"chococake","label":"Chocolate Cake","data":{"totalValue":8},"anchorColor":"var(--anchor-color-6)"}');
});
