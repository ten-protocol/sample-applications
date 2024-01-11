<script setup lang="ts">
	import { useBattleStore } from "../store/battleStore";
	import Gameboard from "./Gameboard.vue";

	const battleStore = useBattleStore();
</script>

<template>
	<div
		class="flex-1 h-[calc(100vh-48px)] overflow-auto hide-scroll flex justify-center gap-6 pt-6 pb-12 px-4">
		<div>
			<div
				class="w-full p-[10px] rounded-[5px] text-white text-center text-[12px] font-bold tracking-[1.8px] bg-gray-blue">
				CPU
			</div>
			<Gameboard user="cpu" />
			<div class="flex flex-col my-8 gap-4 pl-[50px]">
				<div
					class="flex items-center text-[#717C96] text-[12px] font-bold tracking-[1.5px] text-end">
					GRAVEYARD
				</div>
				<div class="flex flex-wrap gap-4 w-full h-[72px]">
					<p v-for="ship in battleStore.cpuSunkShips" :key="ship.shipType">
						{{ ship.name }} ({{ ship.length }})
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
