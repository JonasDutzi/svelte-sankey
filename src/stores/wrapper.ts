import { writable } from 'svelte/store';

export type WrapperStore = {
	height: number;
	width: number;
	top: number;
	left: number;
};

export const wrapperStore = writable<WrapperStore>({
	height: 0,
	width: 0,
	top: 0,
	left: 0
});
