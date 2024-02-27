<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <Game />
        <History />

        <!-- adding admin link to navigate to admin page b'cos using gh-pages w/ SPAs doesn't work well -->
        <router-link to="/admin" class="fixed bottom-4 right-4">
          <span
            class="w-2 h-2 bg-gray-800 hidden rounded-full flex items-center justify-center"
          ></span>
        </router-link>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Game from '../components/Game.vue'
import Header from '../components/Header.vue'
import History from '../components/History.vue'

export default {
  name: 'Home',

  components: {
    Game,
    Header,
    History
  }
}
</script>
