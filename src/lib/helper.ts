/**
 * Dispatches a custom event or calls the provided event handler with the given data.
 *
 * @param hostElement - The HTML element that will dispatch the event if no event handler is provided.
 * @param eventHandler - The event handler function to be called with the data, if provided.
 * @param customEventName - The name of the custom event to be dispatched.
 * @param data - The data to be passed to the event handler or included in the custom event's detail.
 */
export const dispatchCustomEvent = <T>(hostElement: HTMLElement, eventHandler: ((data: T) => void) | undefined, customEventName: string, data: T) => {
	if (eventHandler) {
		eventHandler(data);
	} else {
		hostElement.dispatchEvent(new CustomEvent(customEventName, { detail: data }));
	}
};

export const logWarning = (message?: unknown, ...optionalParams: Array<unknown>) => {
	console.warn("svelte-sankey: ", message, ...optionalParams);
};
export const logError = (message?: unknown, ...optionalParams: Array<unknown>) => {
	console.error("svelte-sankey: ", message, ...optionalParams);
};

/**
 * scales data for visualization
 * @param value the value to be scaled
 * @param range that the values should be in
 * @param min the min value of the dataset
 * @param max the max value of the dataset
 */
export const scaleValue = (value: number, range: Array<number>, minValue: number, maxValue: number): number => {
	const [minRange, maxRange] = range;
	if (isNaN(value) || value === 0 || maxValue === 0) {
		return 0;
	}
	if (minValue === maxValue) {
		return maxRange;
	}
	return Math.max(minRange, (value / maxValue) * maxRange);
};
