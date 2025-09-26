import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { test as baseTest } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const istanbulCLIOutput = path.join(process.cwd(), ".nyc_output");

export function generateUUID(): string {
	return crypto.randomBytes(16).toString("hex");
}

type AxeFixture = {
	axe: () => AxeBuilder;
};

export const test = baseTest.extend<AxeFixture>({
	context: async ({ context }, use) => {
		await context.addInitScript(() => window.addEventListener("beforeunload", () => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))));
		await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
		await context.exposeFunction("collectIstanbulCoverage", (coverageJSON: string) => {
			if (coverageJSON) fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`), coverageJSON);
		});
		await use(context);

		for (const page of context.pages()) {
			await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)));
		}
	},
	axe: async ({ page }, use) => {
		const makeAxeBuilder = () => new AxeBuilder({ page }).disableRules(["page-has-heading-one"]);

		await use(makeAxeBuilder);
	}
});

export const expect = test.expect;
