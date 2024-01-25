<script setup lang="ts">
import Topbar from './Topbar.vue'

const handleClick = (event: MouseEvent) => {
  // Get the mouse position
  const mouseX = event.clientX
  const mouseY = event.clientY

  // Get the image element
  const imgElement = event.target as HTMLImageElement

  // Get the offset of the image within the page
  const imgRect = imgElement.getBoundingClientRect()
  const imgOffsetX = imgRect.left + window.scrollX
  const imgOffsetY = imgRect.top + window.scrollY

  // Calculate the mouse position relative to the image
  const relativeMouseX = mouseX - imgOffsetX
  const relativeMouseY = mouseY - imgOffsetY

  // Log the relative mouse position
  console.log(`Relative Mouse Position: x=${relativeMouseX}, y=${relativeMouseY}`)
}
</script>

<template>
  <div class="w-[70%]">
    <Topbar />
    <div class="max-w-[800px] w-full mx-auto mt-8">
      <img src="../assets/football-clean.png" alt="" class="w-full block" @click="handleClick" />
    </div>
  </div>
</template>
