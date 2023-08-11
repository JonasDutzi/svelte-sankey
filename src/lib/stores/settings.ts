import { writable } from "svelte/store";

export type SettingsStore = {
	maxBoxHeight: number;
	minPathWidth: number;
};

export const settingsStore = writable<SettingsStore>({
	maxBoxHeight: 30,
	minPathWidth: 1
});
