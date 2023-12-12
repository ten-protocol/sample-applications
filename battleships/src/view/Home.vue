<template>
  <connecting-splash v-if="!userConnected"></connecting-splash>
  <battleship-map v-else></battleship-map>
</template>

<script>
import BattleshipMap from "@/components/BattleshipMap.vue";
import ConnectingSplash from "@/components/ConnectingSplash.vue";
import {useWalletStore} from "@/store/walletStore.js";
import {computed} from "vue";

export default {
  name: "Home",
  components: {ConnectingSplash, BattleshipMap},
  setup() {
    const walletStore = useWalletStore();

    // Make userConnected a computed property to react to changes
    const userConnected = computed(() => walletStore.connected());

    // Return the computed property to use in the template
    return {
      userConnected,
    };
  },
}
</script>

<style scoped>

</style>