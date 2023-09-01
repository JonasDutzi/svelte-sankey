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
        return 1;
    }
    if (minValue === maxValue) {
        return maxRange;
    }
    return Math.max(minRange, (value / maxValue) * maxRange);
};
