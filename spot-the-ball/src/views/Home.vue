<template>
  <main class="px-4">
    <Header />
    <!-- <div class="flex justify-between gap-8 items-center"> -->
    <Game />
    <!-- <Controls /> -->
    <!-- </div> -->
    <History />
  </main>
</template>

<script setup>
import Game from '../components/Game.vue'
import Header from '../components/Header.vue'
import History from '../components/History.vue'
</script>
