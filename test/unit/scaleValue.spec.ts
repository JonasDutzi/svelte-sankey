import { describe, it, expect } from "vitest";
import { scaleValue } from "../../src/lib/helper";

describe("scaleValue", () => {
	it("should return 0 if the value is 0", () => {
		const result = scaleValue(0, [1, 30], 0, 60);
		expect(result).toBe(0);
	});
	it("should return 1 if the value is 1", () => {
		const result = scaleValue(1, [1, 30], 0, 60);
		expect(result).toBe(1);
	});
	it("should return 1 if the value is 1", () => {
		const result = scaleValue(10, [1, 100], 0, 50);
		expect(result).toBe(20);
	});
});
