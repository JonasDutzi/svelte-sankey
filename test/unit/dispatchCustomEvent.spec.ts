import { describe, it, expect, vi, beforeEach } from "vitest";
import { dispatchCustomEvent } from "../../src/lib/helper";

describe("dispatchCustomEvent", () => {
	let mockElement: HTMLElement;
	let mockEventHandler: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Create a mock HTML element
		mockElement = {
			dispatchEvent: vi.fn()
		} as unknown as HTMLElement;

		// Create a mock event handler
		mockEventHandler = vi.fn();

		// Clear all mocks
		vi.clearAllMocks();
	});

	describe("when eventHandler is provided", () => {
		it("should call the event handler with the data", () => {
			const testData = { message: "test data" };

			dispatchCustomEvent(mockElement, mockEventHandler, "customEvent", testData);

			expect(mockEventHandler).toHaveBeenCalledOnce();
			expect(mockEventHandler).toHaveBeenCalledWith(testData);
			expect(mockElement.dispatchEvent).not.toHaveBeenCalled();
		});

		it("should call the event handler even when hostElement is undefined", () => {
			const testData = { value: 42 };

			dispatchCustomEvent(undefined, mockEventHandler, "customEvent", testData);

			expect(mockEventHandler).toHaveBeenCalledOnce();
			expect(mockEventHandler).toHaveBeenCalledWith(testData);
		});

		it("should handle different data types", () => {
			const stringData = "test string";
			const numberData = 123;
			const arrayData = [1, 2, 3];
			const objectData = { nested: { value: true } };

			dispatchCustomEvent(mockElement, mockEventHandler, "event1", stringData);
			dispatchCustomEvent(mockElement, mockEventHandler, "event2", numberData);
			dispatchCustomEvent(mockElement, mockEventHandler, "event3", arrayData);
			dispatchCustomEvent(mockElement, mockEventHandler, "event4", objectData);

			expect(mockEventHandler).toHaveBeenCalledTimes(4);
			expect(mockEventHandler).toHaveBeenNthCalledWith(1, stringData);
			expect(mockEventHandler).toHaveBeenNthCalledWith(2, numberData);
			expect(mockEventHandler).toHaveBeenNthCalledWith(3, arrayData);
			expect(mockEventHandler).toHaveBeenNthCalledWith(4, objectData);
		});
	});

	describe("when eventHandler is not provided", () => {
		it("should dispatch custom event on hostElement", () => {
			const testData = { action: "click", id: "button-1" };
			const eventName = "sankeyItemClick";

			dispatchCustomEvent(mockElement, undefined, eventName, testData);

			expect(mockElement.dispatchEvent).toHaveBeenCalledOnce();

			// Check that CustomEvent was created with correct parameters
			const dispatchCall = (mockElement.dispatchEvent as ReturnType<typeof vi.fn>).mock.calls[0];
			const customEvent = dispatchCall[0] as CustomEvent;

			expect(customEvent).toBeInstanceOf(CustomEvent);
			expect(customEvent.type).toBe(eventName);
			expect(customEvent.detail).toEqual(testData);
			expect(customEvent.bubbles).toBe(true);
			expect(customEvent.composed).toBe(true);
		});

		it("should handle null data", () => {
			const eventName = "nullEvent";

			dispatchCustomEvent(mockElement, undefined, eventName, null);

			expect(mockElement.dispatchEvent).toHaveBeenCalledOnce();

			const dispatchCall = (mockElement.dispatchEvent as ReturnType<typeof vi.fn>).mock.calls[0];
			const customEvent = dispatchCall[0] as CustomEvent;

			expect(customEvent.detail).toBeNull();
		});

		it("should handle undefined data", () => {
			const eventName = "undefinedEvent";

			dispatchCustomEvent(mockElement, undefined, eventName, undefined);

			expect(mockElement.dispatchEvent).toHaveBeenCalledOnce();

			const dispatchCall = (mockElement.dispatchEvent as ReturnType<typeof vi.fn>).mock.calls[0];
			const customEvent = dispatchCall[0] as CustomEvent;

			// CustomEvent constructor converts undefined to null in the detail property
			expect(customEvent.detail).toBeNull();
		});
	});

	describe("when both eventHandler and hostElement are not provided", () => {
		it("should log info message and not throw error", () => {
			// Mock console.info to capture log output
			const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

			const testData = { test: "data" };
			const eventName = "testEvent";

			expect(() => {
				dispatchCustomEvent(undefined, undefined, eventName, testData);
			}).not.toThrow();

			expect(consoleSpy).toHaveBeenCalledWith("svelte-sankey: ", `No host element found to dispatch event '${eventName}'`);

			consoleSpy.mockRestore();
		});
	});

	describe("edge cases", () => {
		it("should handle empty string as event name", () => {
			const testData = { test: true };

			dispatchCustomEvent(mockElement, mockEventHandler, "", testData);

			expect(mockEventHandler).toHaveBeenCalledWith(testData);
		});

		it("should handle complex nested object data", () => {
			const complexData = {
				user: {
					id: 123,
					profile: {
						name: "John Doe",
						settings: {
							theme: "dark",
							notifications: true
						}
					}
				},
				metadata: {
					timestamp: new Date(),
					version: "1.0.0"
				}
			};

			dispatchCustomEvent(mockElement, mockEventHandler, "complexEvent", complexData);

			expect(mockEventHandler).toHaveBeenCalledWith(complexData);
		});

		it("should prioritize eventHandler over hostElement", () => {
			const testData = { priority: "handler" };

			dispatchCustomEvent(mockElement, mockEventHandler, "priorityTest", testData);

			expect(mockEventHandler).toHaveBeenCalledWith(testData);
			expect(mockElement.dispatchEvent).not.toHaveBeenCalled();
		});
	});

	describe("type safety", () => {
		it("should work with typed data", () => {
			interface TestData {
				id: number;
				name: string;
				active: boolean;
			}

			const typedHandler = vi.fn();
			const testData: TestData = { id: 1, name: "Test", active: true };

			dispatchCustomEvent<TestData>(mockElement, typedHandler, "typedEvent", testData);

			expect(typedHandler).toHaveBeenCalledWith(testData);
		});
	});
});
