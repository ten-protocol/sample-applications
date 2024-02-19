<template>
  <main class="px-4">
    <Header />
    <Game />
    <!-- <div class="flex justify-between gap-8 items-center">
    <Controls />
    </div> -->
    <History />
    <!-- adding admin link to navigate to admin page b'cos using gh-pages w/ SPAs doesn't work well
    <router-link to="/admin" class="fixed bottom-4 right-4">
      <div class="w-2 h-2 bg-gray-100 rounded-full flex items-center justify-center"></div>
    </router-link> -->
  </main>
</template>

<script >
import Game from '../components/Game.vue'
import Header from '../components/Header.vue'
import History from '../components/History.vue'

export default {
  name: 'Home',

  components: {
    Game,
    Header,
    History
  },

  mounted() {
    const path = localStorage.getItem('path')
    if (path) {
      localStorage.removeItem('path')
      this.router.navigate([path])
    }
  }
}
</script>
