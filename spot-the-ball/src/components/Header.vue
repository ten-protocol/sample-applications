<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="wrapper">
    <div class="py-8 flex items-start justify-between">
      <div class="w-fit px-4 py-2 thick-shadow bg-white border-2 border-black text-sm">
        Welcome to Spot the Ball
      </div>
      <div class="flex flex-col gap-4">
        <div class="w-fit grid grid-cols-2 gap-4 border-2 border-black p-4 text-sm">
          <p>Total Pool:</p>
          <p>7 ETH</p>
          <p>Time remaining:</p>
          <p>4 hours, 16 minutes</p>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <label>Previous moves</label>
        </div>
      </div>
    </div>
  </div>
</template>
