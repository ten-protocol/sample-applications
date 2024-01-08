import { defineStore } from "pinia";

export const useBattleGridStore = defineStore("battleGrid", {
	// State is a function that returns an object
	state: () => ({}),
	// Getters are  like computed properties for stores
	getters: {},
	// Actions can be asynchronous and are where you define methods to change state
	actions: {},
});
