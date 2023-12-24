<script setup lang="ts">
defineProps<{
  playerId: "player" | "opponent";
}>();
</script>

<template>
  <div
    class="w-full p-[10px] rounded-[5px] text-white text-center text-[12px] font-bold tracking-[1.8px]"
    :class="[playerId === 'player' ? 'bg-red' : 'bg-[#717c96]']"
  >
    {{ playerId === "player" ? "YOUR FLEET" : "OPPONENT" }}
  </div>
</template>
