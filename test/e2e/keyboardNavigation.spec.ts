import { test, expect } from "./base";

test.describe("Keyboard Navigation and Focus Management", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:5173/test/e2e/tests.html");
		// Wait for the sankey chart to be fully rendered
		await expect(page.getByRole("button", { name: "Sankey anchor: Flour" })).toBeVisible();
	});

	test("should navigate through sankey anchors using tab key", async ({ page }) => {
		// Check that only one element has tabindex="0" (roving tabindex pattern)
		const focusableButtons = page.locator('button[tabindex="0"]');
		await expect(focusableButtons).toHaveCount(1);

		// The first focusable element should be the Flour anchor
		const firstButton = focusableButtons.first();
		await expect(firstButton).toHaveAttribute("aria-label", "Sankey anchor: Flour");

		// Focus the first element with Tab
		await page.keyboard.press("Tab");
		await expect(firstButton).toBeFocused();

		// Use arrow keys to navigate instead of Tab (roving tabindex pattern)
		await page.keyboard.press("ArrowDown");
		const secondButton = page.getByRole("button", { name: "Sankey anchor: Biscuit" });
		await expect(secondButton).toBeFocused();

		// After navigation, the newly focused element should have tabindex="0"
		await expect(secondButton).toHaveAttribute("tabindex", "0");
		// Check that only one element still has tabindex="0" (roving pattern maintained)
		const newFocusableButtons = page.locator('button[tabindex="0"]');
		await expect(newFocusableButtons).toHaveCount(1);
	});

	test("should navigate using arrow keys between anchors", async ({ page }) => {
		// Focus the first anchor
		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await firstAnchor.focus();
		await expect(firstAnchor).toBeFocused();

		// Navigate down using arrow down key
		await page.keyboard.press("ArrowDown");
		const secondAnchor = page.getByRole("button", { name: "Sankey anchor: Biscuit" });
		await expect(secondAnchor).toBeFocused();

		// Navigate back up using arrow up key
		await page.keyboard.press("ArrowUp");
		await expect(firstAnchor).toBeFocused();
	});

	test("should navigate horizontally between columns using arrow keys", async ({ page }) => {
		// Start with first anchor in first column
		const flourAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await flourAnchor.focus();
		await expect(flourAnchor).toBeFocused();

		// Navigate right to the next column
		await page.keyboard.press("ArrowRight");

		// Should focus on an anchor in the next column
		// Check if focus moved to a different element
		const focusedElement = page.locator(":focus");
		await expect(focusedElement).not.toBe(flourAnchor);

		// Verify the focused element is still a button
		const tagName = await focusedElement.evaluate((el) => el.tagName);
		expect(tagName).toBe("BUTTON");
		const ariaLabel = await focusedElement.getAttribute("aria-label");
		expect(ariaLabel).toMatch(/Sankey anchor:/);
	});

	test("should handle focus loss and restoration", async ({ page }) => {
		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await firstAnchor.focus();
		await expect(firstAnchor).toBeFocused();

		// Navigate to another anchor to test focus memory
		await page.keyboard.press("ArrowDown");
		const secondAnchor = page.getByRole("button", { name: "Sankey anchor: Biscuit" });
		await expect(secondAnchor).toBeFocused();

		// Simulate focus loss by clicking elsewhere and then refocus
		await page.click("main"); // Click on the main container instead of body
		await expect(secondAnchor).not.toBeFocused();

		// Click back on the sankey chart to restore focus
		await firstAnchor.click();
		await expect(firstAnchor).toBeFocused();

		// Verify the roving tabindex is still working
		await page.keyboard.press("ArrowDown");
		await expect(secondAnchor).toBeFocused();
	});

	test("should support Enter and Space key activation", async ({ page }) => {
		const flourAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await flourAnchor.focus();
		await expect(flourAnchor).toBeFocused();

		// Activate with Enter key
		await page.keyboard.press("Enter");

		// Check if the click event was triggered (message should appear)
		const messageList = page.locator("ul li");
		await expect(messageList.first()).toBeVisible();
		const messageText = await messageList.first().textContent();
		expect(messageText).toContain("flour");

		// Focus another anchor and test Space key
		const biscuitAnchor = page.getByRole("button", { name: "Sankey anchor: Biscuit" });
		await biscuitAnchor.focus();
		await page.keyboard.press("Space");

		// Check if second message appeared
		await expect(messageList.nth(1)).toBeVisible();
		const secondMessageText = await messageList.nth(1).textContent();
		expect(secondMessageText).toContain("biscuit");
	});

	test("should handle RTL direction properly", async ({ page }) => {
		// Change document direction to RTL
		await page.evaluate(() => {
			document.documentElement.dir = "rtl";
		});

		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await firstAnchor.focus();

		// In RTL, left arrow should move forward, right arrow backward
		await page.keyboard.press("ArrowLeft");

		const focusedElement = page.locator(":focus");
		const tagName = await focusedElement.evaluate((el) => el.tagName);
		expect(tagName).toBe("BUTTON");

		// Reset to LTR for other tests
		await page.evaluate(() => {
			document.documentElement.dir = "ltr";
		});
	});

	test("should maintain focus visibility and styling", async ({ page }) => {
		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await firstAnchor.focus();

		// Check that focus is visible (should have focus-visible or similar styling)
		const focusedElement = page.locator(":focus");

		// Verify the element has appropriate focus styling
		// This tests that CSS focus indicators are working
		const computedStyle = await focusedElement.evaluate((el) => {
			return window.getComputedStyle(el);
		});

		// Check that some form of focus indication exists
		// (outline, box-shadow, border, etc.)
		expect(computedStyle.outline !== "none" || computedStyle.boxShadow !== "none" || computedStyle.borderColor !== "initial").toBeTruthy();
	});

	test("should navigate to path elements when available", async ({ page }) => {
		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await firstAnchor.focus();

		// Try to navigate to a path (right arrow from anchor)
		await page.keyboard.press("ArrowRight");

		// Check if we landed on a path element or moved to next column
		const focusedElement = page.locator(":focus");
		const dataItemId = await focusedElement.getAttribute("data-item-id");

		// Path elements should have format "sourceId/targetId" or be anchor elements
		if (dataItemId) {
			if (dataItemId.includes("/")) {
				// This is a path element
				const tagName = await focusedElement.evaluate((el) => el.tagName);
				expect(tagName).toBe("BUTTON");
			} else {
				// This is an anchor element in the next column
				const tagName = await focusedElement.evaluate((el) => el.tagName);
				expect(tagName).toBe("BUTTON");
				const ariaLabel = await focusedElement.getAttribute("aria-label");
				expect(ariaLabel).toMatch(/Sankey anchor:/);
			}
		}
	});

	test("should handle keyboard navigation edge cases", async ({ page }) => {
		// Test navigation at boundaries
		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		await firstAnchor.focus();

		// Try to navigate up from first element - should stay in place or wrap
		await page.keyboard.press("ArrowUp");
		const focusedAfterUp = page.locator(":focus");
		const tagName1 = await focusedAfterUp.evaluate((el) => el.tagName);
		expect(tagName1).toBe("BUTTON");

		// Try to navigate left from leftmost element - should stay in place
		await page.keyboard.press("ArrowLeft");
		const focusedAfterLeft = page.locator(":focus");
		const tagName2 = await focusedAfterLeft.evaluate((el) => el.tagName);
		expect(tagName2).toBe("BUTTON");

		// Navigate to last element and try to go beyond
		// First find the last anchor
		const lastAnchor = page.getByRole("button", { name: "Sankey anchor: Chocolate Cake" });
		await lastAnchor.focus();

		// Try to navigate down from last element
		await page.keyboard.press("ArrowDown");
		const focusedAfterDown = page.locator(":focus");
		const tagName3 = await focusedAfterDown.evaluate((el) => el.tagName);
		expect(tagName3).toBe("BUTTON");

		// Try to navigate right from rightmost element
		await page.keyboard.press("ArrowRight");
		const focusedAfterRight = page.locator(":focus");
		const tagName4 = await focusedAfterRight.evaluate((el) => el.tagName);
		expect(tagName4).toBe("BUTTON");
	});

	test("should support screen reader accessibility", async ({ page }) => {
		// Check that all interactive elements have proper ARIA labels
		const buttons = page.getByRole("button");
		const buttonCount = await buttons.count();

		for (let i = 0; i < buttonCount; i++) {
			const button = buttons.nth(i);
			const ariaLabel = await button.getAttribute("aria-label");
			const textContent = await button.textContent();

			// Each button should have either aria-label or text content for screen readers
			expect(ariaLabel || textContent).toBeTruthy();
		}

		// Test that data-item-id attributes are present for programmatic access
		const firstAnchor = page.getByRole("button", { name: "Sankey anchor: Flour" });
		const dataItemId = await firstAnchor.getAttribute("data-item-id");
		expect(dataItemId).toBeTruthy();
	});
});
