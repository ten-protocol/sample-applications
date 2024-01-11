<script setup lang="ts">
	import { CELLS, BATTLESHIPS } from "../lib/constants";
	import ColumnLabels from "../components/ColumnLabels.vue";
	import RowLabels from "../components/RowLabels.vue";
	import { onMounted, ref } from "vue";
	import { useBattleStore } from "../store/battleStore";

	defineProps<{
		user: "player" | "cpu";
	}>();

	const battleStore = useBattleStore();
	const cpuCells = ref<HTMLElement | null>(null);

	function handleShootCpuShip(i: string) {
		if (cpuCells.value) {
			const cells = Array.from(cpuCells.value.children) as HTMLElement[];
			battleStore.shootCpuShip(i, cells, BATTLESHIPS, "Nuel");
		}
	}

	onMounted(() => {
		if (cpuCells.value) {
			const cells = Array.from(cpuCells.value.children) as HTMLElement[];
			BATTLESHIPS.forEach((ship) => battleStore.addCpuShip(ship, cells));

			battleStore.getHitCells();
			battleStore.getHitShips();
			battleStore.getSunkShips();
			battleStore.getMessages();
		}
	});
</script>

<template>
	<div class="relative flex mt-4 h-fit">
		<ColumnLabels />
		<RowLabels />
		<div
			:class="`flex-1 grid grid-cols-10 mt-[50px] ${
				user === 'player' ? 'bg-aqua' : 'bg-gray-light'
			}`"
			:ref="user === 'player' ? 'playerCells' : 'cpuCells'">
			<div
				v-for="(cellName, i) in CELLS"
				:key="cellName"
				:id="String(i + 1)"
				:class="`${cellName} cell flex items-center justify-center border border-white`"
				@click="handleShootCpuShip(String(i + 1))"></div>
		</div>
	</div>
</template>
