<script setup lang="ts">
import { useBattleStore } from "../store/battleStore";
import { computed } from "vue";

const battleStore = useBattleStore();

const reversedMessages = computed(() => {
  return [...battleStore.messages].reverse();
});
</script>

<template>
  <div
    class="w-[500px] h-[calc(100vh-48px)] bg-slate-900 p-6 flex flex-col justify-between"
  >
    <div>
      <button
        class="bg-slate-700 py-[5px] px-4 text-[14px] font-semibold rounded-md border-2 border-slate-800 text-white shadow-md shadow-slate-950/50 hover:bg-slate-700/70"
      >
        Connect Wallet
      </button>
    </div>

    <div
      class="h-[80%] w-full bg-slate-950 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto scroll"
    >
      <p
        v-for="message in reversedMessages"
        :key="message.id"
        class="text-white text-[12px]"
      >
        {{ message.message }}
      </p>
    </div>
  </div>
</template>
