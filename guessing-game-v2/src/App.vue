<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron&display=swap'); /* Add Orbitron font */

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* take the full height of the viewport */
  gap: 25px; /* spacing between flex items */
}
</style>
