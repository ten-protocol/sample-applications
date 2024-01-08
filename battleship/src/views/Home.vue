<script setup lang="ts">
	import { ref, provide, watch } from "vue";
	import Loading from "../components/Loading.vue";
	import Topbar from "../components/Topbar.vue";
	import { Ship } from "../types";
	import Game from "../components/Game.vue";
	import Controls from "../components/Controls.vue";

	const angle = ref(0);
	const width = ref(10);
	const takenBlocks = ref<string[]>([]);
	const shipsAfloat = ref<string[]>([]);
	const info = ref("Click the start button");
	const cpuHitShips = ref<string[]>([]);
	const playerHitShips = ref<string[]>([]);
	const cpuSunkShips = ref<Ship[]>([]);
	const playerSunkShips = ref<Ship[]>([]);
	const turn = ref("");
	const gameOver = ref(false);

	provide("store", {
		angle,
		width,
		takenBlocks,
		shipsAfloat,
		info,
		cpuHitShips,
		playerHitShips,
		cpuSunkShips,
		playerSunkShips,
		turn,
		gameOver,
	});
</script>

<template>
	<!-- <Loading /> -->

	<div>
		<Topbar />

		<div class="flex gap-4">
			<Game />
			<Controls />
		</div>
	</div>
</template>
