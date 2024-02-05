<script setup>
import Gameboard from './Gameboard.vue'
import Topbar from './Topbar.vue'
import { provide, ref } from 'vue'
import GameOver from './GameOver.vue'

const scale = ref(1)
provide('scale', scale)
const position = ref({ x: 0, y: 0 })
let isDragging = false
let lastMousePosition = { x: 0, y: 0 }

function startDrag(event) {
  isDragging = true
  lastMousePosition = getMousePosition(event)
}

function handleZoom(event) {
  scale.value += event.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.max(0.5, Math.min(scale.value, 3))
}

function handleDrag(event) {
  if (!isDragging) return

  const currentMousePosition = getMousePosition(event)
  const deltaX = currentMousePosition.x - lastMousePosition.x
  const deltaY = currentMousePosition.y - lastMousePosition.y

  position.value.x += deltaX
  position.value.y += deltaY

  lastMousePosition = currentMousePosition
}

function stopDrag() {
  isDragging = false
}

function getMousePosition(event) {
  return {
    x: event.clientX || event.touches[0].clientX,
    y: event.clientY || event.touches[0].clientY
  }
}
</script>

<template>
  <div class="flex-1">
    <Topbar />
    <div class="w-full h-[calc(100vh-48px)] p-4 relative">
      <div
        class="w-[1000px] h-full overflow-auto mx-auto"
        @wheel.prevent="handleZoom"
        @mousedown="startDrag"
        @mousemove="handleDrag"
        @mouseup="stopDrag"
        @touchstart="startDrag"
        @touchmove="handleDrag"
        @touchend="stopDrag"
      >
        <div
          class="zoom-content"
          :style="{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`
          }"
        >
          <Gameboard user="cpu" />
        </div>
      </div>

      <GameOver />
    </div>
  </div>
</template>

<style scoped>
.zoom-content {
  transition: transform 0.3s ease-out;
}
</style>
