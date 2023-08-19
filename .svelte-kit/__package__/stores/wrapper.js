import { writable } from 'svelte/store';
export const wrapperStore = writable({
    height: 0,
    width: 0,
    top: 0,
    left: 0
});
