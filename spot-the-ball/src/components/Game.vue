<script setup lang="ts">
import { ref } from 'vue'

const relativeMouseX = ref(0)
const relativeMouseY = ref(0)
const imageContainer = ref<HTMLImageElement | null>(null)
const mouseIsInImage = ref(false)
const circleSize = 90
const circleRef = ref<HTMLElement | null>(null)
const isWithinThreshold = ref(false)

const handleClick = () => {
  if (isWithinThreshold.value) {
    circleRef.value!.style.backgroundColor = 'skyblue'
    console.log(`Relative Mouse Position: x=${relativeMouseX.value}, y=${relativeMouseY.value}`)
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (imageContainer.value) {
    const mouseX = event.clientX
    const mouseY = event.clientY

    const containerRect = imageContainer.value.getBoundingClientRect()
    const containerOffsetX = containerRect.left
    const containerOffsetY = containerRect.top

    relativeMouseX.value = mouseX - containerOffsetX
    relativeMouseY.value = mouseY - containerOffsetY

    const edgeThreshold = 20

    isWithinThreshold.value =
      mouseX >= containerRect.left + edgeThreshold &&
      mouseX <= containerRect.right - edgeThreshold &&
      mouseY >= containerRect.top + edgeThreshold &&
      mouseY <= containerRect.bottom - edgeThreshold

    mouseIsInImage.value = isWithinThreshold.value
  }
}

const handleMouseOver = (event: MouseEvent) => {
  mouseIsInImage.value = true
}

const handleMouseLeave = (event: MouseEvent) => {
  mouseIsInImage.value = false
}
</script>

<template>
  <div class="wrapper py-8">
    <div
      class="w-[1000px] mx-auto cursor-pointer relative"
      ref="imageContainer"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    >
      <img src="../assets/football-clean.png" alt="" class="w-full block" />
      <div
        class="absolute border-[4px] border-white rounded-full"
        ref="circleRef"
        :style="{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          top: `${mouseIsInImage ? `${relativeMouseY - circleSize / 2}px` : '50%'}`,
          left: `${mouseIsInImage ? `${relativeMouseX - circleSize / 2}px` : '50%'}`,
          transform: `${mouseIsInImage ? `` : 'translate(-50%,-50%)'}`
        }"
      ></div>
    </div>
  </div>
</template>
