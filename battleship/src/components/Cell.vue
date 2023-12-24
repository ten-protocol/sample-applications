<script setup lang="ts">
defineProps<{
  playerId?: "player" | "opponent";
  id: string;
  text?: string;
}>();

const xxx = (id: string) => {
  console.log(id);
};
</script>

<template>
  <div
    :id="id"
    class="w-[30px] min-[480px]:w-[40px] h-[30px] min-[480px]:h-[40px] flex items-center justify-center rounded-[4px] border-2 border-white cursor-pointer"
    :class="[
      playerId === 'player'
        ? 'bg-[#61c6ff33]'
        : playerId === 'opponent'
        ? 'bg-[#9d9d9d33]'
        : 'bg-white text-[#717c96b3] text-center text-[12px] min-[480px]:text-[16px] font-bold tracking-[0.8px]',
    ]"
    @click="() => xxx(id)"
  >
    {{ text }}
  </div>
</template>
