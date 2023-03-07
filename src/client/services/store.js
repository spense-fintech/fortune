import { writable } from "svelte-local-storage-store";
export const session = writable("session", {});
export const state = writable("state", {});
export const cache = writable("cache", {});
