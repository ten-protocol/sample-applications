<script setup lang="ts">
	import { inject, ref, Ref } from "vue";
	import { Ship } from "../types";

	defineProps<{
		ship: Ship;
	}>();

	const { angle, shipsAfloat } = inject("store") as {
		angle: Ref<number>;
		shipsAfloat: Ref<string[]>;
	};
	const shipRef = ref<HTMLElement | null>(null);

	function dragStart(e: DragEvent) {
		if (e.target instanceof HTMLElement) {
			e.dataTransfer!.setData("text", e.target.id);
		}
	}
</script>

<template>
	<img
		:src="`${
			shipsAfloat.includes(ship.shipType)
				? ''
				: angle === 0
				? ship.imageX
				: ship.imageY
		}`"
		:alt="ship.name"
		:id="ship.shipType"
		:class="`flex cursor-grab ${ship.shipType}`"
		draggable="true"
		@dragstart="dragStart($event)"
		ref="shipRef" />
</template>
