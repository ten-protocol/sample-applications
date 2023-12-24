<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";

async function loadGame() {
  const loadingScreen = document.querySelector(
    ".loading-screen"
  ) as HTMLElement | null;
  const progressBar = document.querySelector(
    ".loading__bar span"
  ) as HTMLSpanElement | null;

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function animateProgressBar(width: string, duration: number) {
    progressBar!.style.width = width;
    await delay(duration);
  }

  try {
    await delay(1000);

    await animateProgressBar("5%", 2000);
    await animateProgressBar("20%", 1000);
    await animateProgressBar("70%", 1000);
    await animateProgressBar("100%", 1000);

    loadingScreen!.style.display = "none";
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

onMounted(() => {
  document.addEventListener("DOMContentLoaded", loadGame);
});

onBeforeUnmount(() => {
  document.removeEventListener("DOMContentLoaded", loadGame);
});
</script>

<template>
  <div
    class="loading-screen w-screen h-screen bg-black fixed top-0 left-0 flex justify-center items-center z-20"
  >
    <div class="loading-screen__ship top-0 left-[64px]">
      <img src="../assets/Ship1.svg" alt="ship1" />
    </div>
    <div class="loading-screen__ship top-[47px] left-[236px]">
      <img src="../assets/Ship2.svg" alt="ship2" />
    </div>
    <div class="loading-screen__ship top-[80px] right-[119px]">
      <img src="../assets/Ship3.svg" alt="ship3" />
    </div>
    <div class="loading-screen__ship bottom-[68px] left-[152px]">
      <img src="../assets/Ship4.svg" alt="ship4" />
    </div>
    <div class="loading-screen__ship bottom-[53px] right-[168px]">
      <img src="../assets/Ship5.svg" alt="ship5" />
    </div>
    <div class="max-w-[695px] w-full flex flex-col items-center">
      <p
        class="text-yellow text-center text-[23.354px] font-normal tracking-[4.437px] mb-[26px]"
      >
        THE CLASSIC NAVAL COMBAT GAME
      </p>
      <div>
        <img src="../assets/battleship.svg" alt="battleship" />
      </div>
      <div class="w-full flex flex-col gap-4 items-center">
        <div
          class="loading__bar w-full h-[66px] rounded-xl border-2 border-white overflow-hidden mt-12"
        >
          <span
            class="rounded-[5px] bg-red w-0 h-full block transition-all duration-300"
          ></span>
        </div>
        <div
          class="loading__text text-white text-[23.354px] font-normal tracking-[2.335px]"
        >
          LOADING
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen__ship {
  width: fit-content;
  position: absolute;
}

.loading__text:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  animation: ellipsis steps(4, end) 2s infinite;
  content: "\2026";
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>
