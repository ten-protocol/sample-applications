<script setup lang="ts">
import GameBoard from "./GameBoard.vue";
import PlayerId from "./PlayerId.vue";
</script>

<template>
  <div class="w-fit">
    <PlayerId :playerId="'opponent'" />
    <GameBoard :playerId="'opponent'" />
    <div class="flex mt-8">
      <div
        class="flex items-center w-fit transform rotate-[-90deg] text-[#717C96] text-[12px] font-bold tracking-[1.5px] text-endz"
      >
        GRAVEYARD
      </div>
      <div class="flex-1 max-w-[370px] flex flex-wrap gap-2 h-[136px]"></div>
    </div>
  </div>
</template>
