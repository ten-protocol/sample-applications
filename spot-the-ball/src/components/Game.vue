<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/gameStore'
import Web3Service from '../lib/web3service'
import { useMessageStore } from '../stores/messageStore'
import { useWalletStore } from '../stores/walletStore'
import { CIRCLE_SIZE } from '../lib/utils'

const gameStore = useGameStore()

const relativeMouseX = ref(0)
const relativeMouseY = ref(0)
const imageContainer = ref<HTMLImageElement | null>(null)
const mouseIsInImage = ref(false)
const circleSize = CIRCLE_SIZE
const circleRef = ref<HTMLElement | null>(null)
const isWithinThreshold = ref(false)

const game = ref()
const gameActive = ref(gameStore.isGameActive)
const gameRevealed = ref(gameStore.isGameRevealed)
const submitDisabled = ref(false)
const HISTORY = ref(gameStore.history)
const showPreviousMoves = ref(gameStore.showPreviousMoves)

watchEffect(() => {
  game.value = gameStore.game
  HISTORY.value = gameStore.history
  showPreviousMoves.value = gameStore.showPreviousMoves
  gameRevealed.value = gameStore.isGameRevealed
  gameActive.value = gameStore.isGameActive
})

const handleClick = async () => {
  if (isWithinThreshold.value && !gameRevealed.value && gameActive.value) {
    await submit()
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (imageContainer.value) {
    const mouseX = event.clientX
    const mouseY = event.clientY

    const containerRect = imageContainer.value.getBoundingClientRect()
    // update relative mouse position only if mouse is within the container
    const containerOffsetX = containerRect.left
    const containerOffsetY = containerRect.top

    relativeMouseX.value = mouseX - containerOffsetX
    relativeMouseY.value = mouseY - containerOffsetY

    const edgeThreshold = 20

    isWithinThreshold.value =
      mouseX >= containerRect.left + edgeThreshold &&
      mouseX <= containerRect.right - edgeThreshold &&
      mouseY >= containerRect.top + edgeThreshold &&
      mouseY <= containerRect.bottom - edgeThreshold

    mouseIsInImage.value = isWithinThreshold.value
  }
}

const handleMouseOver = (event: MouseEvent) => {
  mouseIsInImage.value = true
}

const handleMouseLeave = (event: MouseEvent) => {
  // mouseIsInImage.value = false
}

const submit = async () => {
  if (window.confirm('Are you sure you want to submit this guess?') === false) {
    return
  }
  submitDisabled.value = true
  gameStore.loading = true
  try {
    const messageStore = useMessageStore()
    const walletStore = useWalletStore()

    if (!walletStore.signer) {
      messageStore.addMessage('Not connected with Metamask...')
      submitDisabled.value = false
      gameStore.loading = false
      return
    }
    const web3Service = new Web3Service(walletStore.signer)
    const challengeId = await web3Service.getChallengeId()
    const payload = [
      challengeId,
      [Math.round(relativeMouseX.value), Math.round(relativeMouseY.value)]
    ]
    const res = await web3Service.submitGuess(...payload)
    if (res) {
      gameStore.showModal('', res)
    }
  } catch (err) {
    console.error('Error:', err.message)
  }
  submitDisabled.value = false
  gameStore.loading = false
}
</script>

<template>
  <div class="max-w-[1300px] mx-auto w-full px-4">
    <div
      class="w-[800px] mx-auto cursor-pointer relative"
      ref="imageContainer"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    >
      <template v-if="game?.[0] && !gameRevealed">
        <img
          :src="game[0]"
          alt="Spot the ball"
          :class="{ 'w-full block': game, 'cursor-not-allowed': gameRevealed }"
        />
      </template>
      <template v-else>
        <div class="w-full h-[500px] bg-gray-200 cursor-not-allowed relative">
          <div class="flex items-center justify-center h-full">
            <p class="text-2xl">No challenge available</p>
          </div>
        </div>
      </template>
      <div
        v-if="!gameRevealed && game[0]"
        class="absolute border-[4px] border-white rounded-full"
        ref="circleRef"
        :style="{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          top: `${mouseIsInImage ? `${relativeMouseY - circleSize / 2}px` : '50%'}`,
          left: `${mouseIsInImage ? `${relativeMouseX - circleSize / 2}px` : '50%'}`,
          transform: `${mouseIsInImage ? `` : 'translate(-50%,-50%)'}`
        }"
      ></div>
      <template v-if="showPreviousMoves">
        <template v-if="HISTORY">
          <div
            v-for="(move, index) in HISTORY"
            :key="index"
            class="absolute border-[4px] border-white rounded-full"
            :style="{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              top: `${move.y - circleSize / 2}px`,
              left: `${move.x - circleSize / 2}px`,
              background: 'rgba(255, 0, 0, 0.5)'
            }"
          ></div>
        </template>
      </template>
    </div>
  </div>
</template>
