<script setup lang="ts">
import GameBoard from "./GameBoard.vue";
import PlayerId from "./PlayerId.vue";
import Cruiser from "./battleships/Cruiser.vue";
import Submarine from "./battleships/Submarine.vue";
import Destroyer from "./battleships/Destroyer.vue";
import Battleship from "./battleships/Battleship.vue";
import AircraftCarrier from "./battleships/AircraftCarrier.vue";
</script>

<template>
  <div class="w-fit">
    <PlayerId :playerId="'player'" />
    <GameBoard :playerId="'player'" />
    <div class="flex mt-8">
      <div
        class="flex items-center w-fit transform rotate-[-90deg] text-[#717C96] text-[12px] font-bold tracking-[1.5px] text-endz"
      >
        SHIPYARD
      </div>
      <div class="flex-1 max-w-[370px] flex flex-wrap gap-2 h-[136px]">
        <Battleship />
        <Submarine />
        <Cruiser />
        <AircraftCarrier />
        <Destroyer />
      </div>
    </div>
  </div>
</template>
