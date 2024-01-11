<script setup lang="ts">
	import { ROW_LABELS } from "../lib/constants";
</script>

<template>
	<div class="w-fit grid grid-cols-1">
		<div
			class="cell flex items-center justify-center rounded-[4px] border-2 border-white text-gray-dark text-center text-[12px] min-[480px]:text-[16px] font-bold tracking-[0.8px]"
			v-for="label in ROW_LABELS"
			:key="label"
			:id="`${label}-label`"
			:text="label">
			{{ label }}
		</div>
	</div>
</template>
