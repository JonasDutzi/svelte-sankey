import { describe, it, expect, beforeEach } from "vitest";
import { wrapperStore } from "../../src/lib/stores/wrapper.svelte";
import type { Wrapper } from "../../src/lib/stores/wrapper.svelte";

describe("WrapperStore", () => {
	beforeEach(() => {
		// Reset the store to initial state before each test
		wrapperStore.set({
			height: 0,
			width: 0,
			top: 0,
			left: 0
		});
	});

	describe("initial state", () => {
		it("should have correct default values", () => {
			expect(wrapperStore.height).toBe(0);
			expect(wrapperStore.width).toBe(0);
			expect(wrapperStore.top).toBe(0);
			expect(wrapperStore.left).toBe(0);
		});
	});

	describe("property getters", () => {
		it("should get height", () => {
			wrapperStore.set({ height: 500, width: 0, top: 0, left: 0 });
			expect(wrapperStore.height).toBe(500);
		});

		it("should get width", () => {
			wrapperStore.set({ height: 0, width: 800, top: 0, left: 0 });
			expect(wrapperStore.width).toBe(800);
		});

		it("should get top", () => {
			wrapperStore.set({ height: 0, width: 0, top: 100, left: 0 });
			expect(wrapperStore.top).toBe(100);
		});

		it("should get left", () => {
			wrapperStore.set({ height: 0, width: 0, top: 0, left: 150 });
			expect(wrapperStore.left).toBe(150);
		});
	});

	describe("set method", () => {
		it("should replace the entire state", () => {
			const newState: Wrapper = {
				height: 600,
				width: 900,
				top: 50,
				left: 75
			};

			wrapperStore.set(newState);

			expect(wrapperStore.height).toBe(600);
			expect(wrapperStore.width).toBe(900);
			expect(wrapperStore.top).toBe(50);
			expect(wrapperStore.left).toBe(75);
		});
	});

	describe("data property access", () => {
		it("should access data through data property", () => {
			wrapperStore.set({
				height: 400,
				width: 700,
				top: 25,
				left: 30
			});

			expect(wrapperStore.data.height).toBe(400);
			expect(wrapperStore.data.width).toBe(700);
			expect(wrapperStore.data.top).toBe(25);
			expect(wrapperStore.data.left).toBe(30);
		});
	});

	describe("state consistency", () => {
		it("should maintain state consistency when setting complete state", () => {
			wrapperStore.set({
				height: 300,
				width: 500,
				top: 10,
				left: 20
			});

			expect(wrapperStore.height).toBe(300);
			expect(wrapperStore.width).toBe(500);
			expect(wrapperStore.top).toBe(10);
			expect(wrapperStore.left).toBe(20);
		});
	});
});
