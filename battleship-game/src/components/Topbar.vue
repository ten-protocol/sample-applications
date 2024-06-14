<script setup>
import { inject } from 'vue'
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'

const scale = inject('scale')

function zoomIn() {
  scale.value = Math.min(scale.value + 0.1, 3)
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.1, 0.5)
}
</script>

<template>
  <div class="w-full h-[48px] bg-slate-800 flex items-center justify-between p-4">
    <div class="text-white font-bold brand-text tracking-widest text-2xl">BATTLESHIPS</div>

    <div class="flex items-center gap-4">
      <MetaMaskConnectButton />
      <div class="flex items-center gap-1">
        <button
          class="bg-slate-700 text-white rounded-lg w-[30px] aspect-square text-[14px]"
          @click="zoomIn"
        >
          +
        </button>
        <span class="bg-slate-700 text-white rounded-lg py-1 px-4 text-[14px]"> Zoom </span>
        <button
          class="bg-slate-700 text-white rounded-lg w-[30px] aspect-square text-[14px]"
          @click="zoomOut"
        >
          -
        </button>
      </div>
    </div>
  </div>
</template>
