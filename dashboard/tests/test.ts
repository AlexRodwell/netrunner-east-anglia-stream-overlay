import { test, expect } from "@playwright/test";

test("home has dashboard button", async ({ page }) => {
	await page.goto("/");
	// await expect(page.waitForSelector('button[href="/overlay"]')).toBeVisible();
	await page.isVisible("a.button[href='/overlay']");
});

test("Increment agendas", async ({ page }) => {
	// Create two pages
	const dashboard = await page.context().newPage();
	const overlay = await page.context().newPage();

	// Load pages in parallel to ensure the overlay recieves a websocket connection
	await Promise.all([dashboard.goto("/dashboard"), overlay.goto("/overlay")]);

	await dashboard.waitForTimeout(1000);

	const elements = [
		{
			query: "#counter-agendas-playerOne button:last-of-type",
			clicks: 4,
		},
	];

	elements.forEach(({ query, clicks }) => {
		for (let i = 0; i < clicks; i++) {
			dashboard.click(query);
		}
	});

	await dashboard.waitForTimeout(1000);

	dashboard.click("#counter-agendas-playerOne button:first-of-type"); // Remove one point

	await dashboard.waitForTimeout(1000);

	// Step 5: Check if the value matches
	const count = await overlay.$eval(
		".side.side--left .counter__number:last-of-type",
		(element) => {
			return element.textContent;
		}
	);

	expect(count).toBe("3");

	// console.info("counterNumber:", counterNumber);
	// console.info(counterNumber === "4");
});
