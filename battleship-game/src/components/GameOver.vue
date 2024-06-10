<script setup>
import { ref, watchEffect } from 'vue'
import { useBattleStore } from '../stores/battleStore'
const battleStore = useBattleStore()

const gameOver = ref(false)

watchEffect(() => {
  gameOver.value = battleStore.gameOver
})
</script>

<template>
  <div
    v-if="gameOver"
    class="w-full h-full bg-black absolute top-0 left-0 text-[80px] text-white flex flex-col items-center gap-12 justify-center text-center"
  >
    <p>GAME OVER</p>
    <div class="flex flex-col items-center justify-center text-center text-white gap-4 text-base">
      <div class="lds-hourglass"></div>
      <p>Resetting game...</p>
    </div>
  </div>
</template>

<style scoped>
.lds-hourglass {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-hourglass:after {
  content: ' ';
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}
</style>
