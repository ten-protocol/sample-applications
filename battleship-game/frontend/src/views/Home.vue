<script setup lang="ts">
// import Loading from '../components/Loading.vue'
import Topbar from '../components/Topbar.vue'
import Game from '../components/Game.vue'
import Controls from '../components/Controls.vue'
</script>

<template>
  <!-- <Loading /> -->

  <div>
    <Topbar />

    <div class="flex gap-4">
      <Game />
      <Controls />
    </div>
  </div>
</template>
