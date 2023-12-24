<script setup lang="ts">
import Loading from "../components/Loading.vue";
import Topbar from "../components/Topbar.vue";
import Player from "../components/Player.vue";
import Opponent from "../components/Opponent.vue";
</script>

<template>
  <Loading />
  <div>
    <Topbar />
    <div
      class="h-fit flex flex-col max-[1024px]:items-center lg:flex-row lg:justify-center gap-12 py-6 px-4"
    >
      <Player />
      <div class="w-full lg:w-[1px] max-[1024px]:h-[1px] bg-[#727d9736]"></div>
      <Opponent />
    </div>
  </div>
</template>
