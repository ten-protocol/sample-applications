<script setup lang="ts">
import Loading from '../components/Loading.vue'
import Game from '../components/Game.vue'
import Controls from '../components/Controls.vue'
</script>

<template>
  <Loading />

  <div class="flex max-w-full">
    <Game />
    <Controls />
  </div>
</template>
