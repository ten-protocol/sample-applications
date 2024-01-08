<script setup lang="ts">
	import { Ref, inject } from "vue";
	import battleships from "../data/battleships";
	import Battleship from "./Battleship.vue";
	import { Ship } from "../types";
	import Divider from "./Divider.vue";
	import Gameboard from "./Gameboard.vue";

	const { angle, cpuSunkShips } = inject("store") as {
		angle: Ref<number>;
		cpuSunkShips: Ref<Ship[]>;
	};

	function flipShips() {
		angle.value = angle.value === 0 ? 90 : 0;
	}
</script>

<template>
	<div class="flex-1 h-fit flex justify-center gap-6 py-6 px-4">
		<div class="w-fit">
			<div
				class="w-full p-[10px] rounded-[5px] text-white text-center text-[12px] font-bold tracking-[1.8px] bg-red">
				YOUR FLEET
			</div>
			<Gameboard user="player" />
			<div class="flex mt-8">
				<div
					class="flex items-center w-fit transform rotate-[-90deg] text-[#717C96] text-[12px] font-bold tracking-[1.5px] text-end">
					SHIPYARD
				</div>
				<div
					class="flex flex-wrap gap-4 max-w-[320px] h-[72px]"
					ref="shipYardRef">
					<Battleship
						v-for="ship in battleships"
						:key="ship.shipType"
						:ship="ship" />
				</div>
			</div>
			<div class="flex items-center gap-4 mt-8">
				<button
					id="flip-btn"
					class="bg-neutral-200 py-[5px] px-4 text-[14px] font-semibold rounded-md border-2 border-neutral-300"
					@click="flipShips">
					Flip
				</button>
			</div>
		</div>

		<Divider />

		<div class="w-fit">
			<div
				class="w-full p-[10px] rounded-[5px] text-white text-center text-[12px] font-bold tracking-[1.8px] bg-gray-blue">
				OPPONENT
			</div>
			<Gameboard user="cpu" />
			<div class="flex mt-8">
				<div
					class="flex items-center w-fit transform rotate-[-90deg] text-[#717C96] text-[12px] font-bold tracking-[1.5px] text-end">
					GRAVEYARD
				</div>
				<div class="flex flex-wrap gap-4 max-w-[320px] h-[72px]">
					<p v-for="ship in cpuSunkShips" :key="ship.shipType">
						{{ ship.name }} ({{ ship.length }})
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
