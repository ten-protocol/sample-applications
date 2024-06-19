<script setup>
import { provide, ref, watch } from 'vue'
import { debounce } from 'lodash'

import Gameboard from './Gameboard.vue'
import Topbar from './Topbar.vue'
import GameOver from './GameOver.vue'

const scale = ref(1)
provide('scale', scale)

const position = ref({ x: 0, y: 0 })

let isDragging = false
let lastMousePosition = { x: 0, y: 0 }
let dragVelocity = { x: 0, y: 0 }

const startDrag = (event) => {
  isDragging = true
  lastMousePosition = getMousePosition(event)
  dragVelocity = { x: 0, y: 0 }
}

const handleZoom = (event) => {
  event.preventDefault()
  const zoomIntensity = 0.1
  const newScale = Math.max(
    0.5,
    Math.min(scale.value + (event.deltaY > 0 ? -zoomIntensity : zoomIntensity), 3)
  )
  scale.value = newScale
}

const handleDrag = (event) => {
  if (!isDragging) {
    return
  }

  const currentMousePosition = getMousePosition(event)
  const deltaX = currentMousePosition.x - lastMousePosition.x
  const deltaY = currentMousePosition.y - lastMousePosition.y

  // drag velocity with a low-pass filter for smoother damping
  dragVelocity.x = dragVelocity.x * 0.9 + deltaX * 0.1
  dragVelocity.y = dragVelocity.y * 0.9 + deltaY * 0.1

  position.value.x += dragVelocity.x
  position.value.y += dragVelocity.y

  lastMousePosition = currentMousePosition
}

const stopDrag = () => {
  isDragging = false
}

const getMousePosition = (event) => ({
  x: event.clientX || event.touches[0].clientX,
  y: event.clientY || event.touches[0].clientY
})

watch(scale, (newScale) => {
  const zoomIndicatorElement = document.querySelector('.zoom-indicator')
  if (zoomIndicatorElement) {
    zoomIndicatorElement.textContent = `${Math.round(newScale * 100)}%`
  }
})

const handleZoomDebounced = debounce(handleZoom, 50)
</script>


<template>
  <div class="flex-1">
    <Topbar />
    <div class="w-full h-[calc(100vh-48px)] p-4 relative">
      <div
        class="w-[1000px] h-full overflow-hidden mx-auto relative"
        @wheel.prevent="handleZoomDebounced"
        @mousedown="startDrag"
        @mousemove="handleDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startDrag"
        @touchmove="handleDrag"
        @touchend="stopDrag"
      >
        <div
          class="zoom-content absolute top-0 left-0"
          :style="{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`
          }"
        >
          <Gameboard />
        </div>
        <div class="zoom-indicator fixed left-4 bottom-4 p-2 rounded-md bg-gray-800 text-white">
          {{ Math.round(scale * 100) }}%
        </div>
      </div>
      <GameOver />
    </div>
  </div>
</template>

<style scoped>
.zoom-content {
  transition: transform 0.3s ease-out;
  transform-origin: top left;
}
</style>
