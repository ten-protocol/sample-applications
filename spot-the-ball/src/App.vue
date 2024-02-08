<template>
  <div>
    <!-- loading overlay if loading is true -->
    <Loader v-if="gameStore.loading" />

    <RouterView />

    <Modal v-if="gameStore.modalVisible" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Loader from './components/Loader.vue'
import Modal from './components/Modal.vue'
import { useGameStore } from './stores/gameStore'

const gameStore = useGameStore()
</script>
