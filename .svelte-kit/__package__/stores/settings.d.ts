/// <reference types="svelte" />
export type SettingsStore = {
    maxBoxHeight: number;
    minPathWidth: number;
};
export declare const settingsStore: import("svelte/store").Writable<SettingsStore>;
