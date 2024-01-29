<script setup lang="ts">
import { ref } from 'vue'
import Topbar from './Topbar.vue'

const relativeMouseX = ref(0)
const relativeMouseY = ref(0)
const imgElement = ref<HTMLImageElement | null>(null)
const mouseIsInImage = ref(false)
const circleSize = 90
const circleRef = ref<HTMLElement | null>(null)

const handleClick = (event: MouseEvent) => {
  let mouseX = event.clientX
  let mouseY = event.clientY

  if (imgElement.value) {
    const imgRect = imgElement.value.getBoundingClientRect()
    const imgOffsetX = imgRect.left + window.scrollX
    const imgOffsetY = imgRect.top + window.scrollY

    relativeMouseX.value = mouseX - imgOffsetX
    relativeMouseY.value = mouseY - imgOffsetY

    console.log(`Relative Mouse Position: x=${relativeMouseX.value}, y=${relativeMouseY.value}`)

    if (circleRef.value) {
      circleRef.value.style.backgroundColor = 'red'
    }
  }
}

const handleMouseOver = (event: MouseEvent) => {
  mouseIsInImage.value = true
}

const handleMouseLeave = (event: MouseEvent) => {
  mouseIsInImage.value = false
}

const handleMouseMove = (event: MouseEvent) => {
  let mouseX = event.clientX
  let mouseY = event.clientY

  if (imgElement.value) {
    const imgRect = imgElement.value.getBoundingClientRect()
    const imgOffsetX = imgRect.left + window.scrollX
    const imgOffsetY = imgRect.top + window.scrollY

    relativeMouseX.value = mouseX - imgOffsetX
    relativeMouseY.value = mouseY - imgOffsetY
  }
}
</script>

<template>
  <div class="w-[70%]">
    <Topbar />
    <div
      class="max-w-[800px] w-full mx-auto mt-8 cursor-pointer relative"
      @click="handleClick"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
      ref="imgElement"
    >
      <div
        v-if="mouseIsInImage"
        class="absolute border-[4px] border-white rounded-full bg-red-500"
        ref="circleRef"
        :style="{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          left: `${relativeMouseX - circleSize / 2}px`,
          top: `${relativeMouseY - circleSize / 2}px`
        }"
      ></div>

      <img src="../assets/football-clean.png" alt="" class="w-full block" />
    </div>
  </div>
</template>
