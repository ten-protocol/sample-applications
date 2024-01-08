// useEventStore.js
import { defineStore } from "pinia";
import { useContractStore } from "@/store/contractStore.js";
import { useBattleGridStore } from "@/store/battleGridStore.js";

export const useEventStore = defineStore("events", {
	state: () => ({
		transactions: [],
	}),

	actions: {
		async fetchTransactions() {
			const contractStore = useContractStore();
			const battleGridStore = useBattleGridStore();

			// Access the contract instance from the contract store
			const contract = contractStore.getContract;

			// Query the filter for logs
			const logs = await contract.queryFilter(
				contract.filters.PlayerShoots(),
				0,
				"latest"
			);

			logs.forEach((log) => {
				console.log(log);
				battleGridStore.shoot();
			});

			// Store the fetched transactions in state
			this.transactions = logs.map((log) => log.args);
		},
	},
});
