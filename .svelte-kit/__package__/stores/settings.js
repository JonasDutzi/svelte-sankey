import { writable } from "svelte/store";
export const settingsStore = writable({
    maxBoxHeight: 30,
    minPathWidth: 1
});
