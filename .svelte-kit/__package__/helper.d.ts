export declare const logWarning: (message?: unknown, ...optionalParams: Array<unknown>) => void;
export declare const logError: (message?: unknown, ...optionalParams: Array<unknown>) => void;
/**
 * scales data in order to map data for visualization
 * @param value the value to be scaled
 * @param range that the values should be in
 * @param minBoxHeight the minimun height for a node box
 * @param min the min value of the dataset
 * @param max the max value of the dataset
 */
export declare const scaleValue: (value: number, range: Array<number>, min: number, max: number) => number;
