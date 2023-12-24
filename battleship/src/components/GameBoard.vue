<script setup lang="ts">
import Cell from "./Cell.vue";
import cells from "../data/cells";
import labels from "../data/labels";

defineProps<{
  playerId: "player" | "opponent";
}>();
</script>

<template>
  <div class="relative flex mt-4">
    <div class="w-fit grid grid-cols-10 absolute top-0 right-0">
      <Cell
        v-for="label in labels.columnLabels"
        :key="label"
        :id="label"
        :text="label"
      />
    </div>
    <div class="w-fit grid grid-cols-1">
      <Cell
        v-for="label in labels.rowLabels"
        :key="label"
        :id="label"
        :text="label"
      />
    </div>
    <div
      class="flex-1 grid grid-cols-10 mt-[40px]"
      ondrop="drop(event)"
      ondragover="allowDrop(event)"
    >
      <Cell v-for="cell in cells" :key="cell" :playerId="playerId" :id="cell" />
    </div>
  </div>
</template>
