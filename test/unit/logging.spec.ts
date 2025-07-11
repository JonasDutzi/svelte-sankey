import { describe, it, expect, vi } from "vitest";
import { logError, logWarning } from "../../src/lib/helper";

describe("log", () => {
	it("should log a warning with a prefix", () => {
		const consoleMock = vi.spyOn(console, "warn").mockImplementation(() => undefined);
		logWarning("a warning");
		expect(consoleMock).toHaveBeenCalledWith("svelte-sankey: ", "a warning");
	});
	it("should log an error with a prefix", () => {
		const consoleMock = vi.spyOn(console, "error").mockImplementation(() => undefined);
		logError("an error");
		expect(consoleMock).toHaveBeenCalledWith("svelte-sankey: ", "an error");
	});
});
