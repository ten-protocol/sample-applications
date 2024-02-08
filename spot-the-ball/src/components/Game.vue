<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ethers } from 'ethers'
import { useGameStore } from '../stores/gameStore'
import Web3Service from '../lib/web3service'
import { useMessageStore } from '../stores/messageStore'
import { useWalletStore } from '../stores/walletStore'

const gameStore = useGameStore()

const relativeMouseX = ref(0)
const relativeMouseY = ref(0)
const imageContainer = ref<HTMLImageElement | null>(null)
const mouseIsInImage = ref(false)
const circleSize = 90
const circleRef = ref<HTMLElement | null>(null)
const isWithinThreshold = ref(false)

const game = ref()
const submitDisabled = ref(false)
const HISTORY = ref(gameStore.history)
const showPreviousMoves = ref(gameStore.showPreviousMoves)

watchEffect(() => {
  game.value = gameStore.game
  HISTORY.value = gameStore.history
  showPreviousMoves.value = gameStore.showPreviousMoves
})

const handleClick = async () => {
  if (isWithinThreshold.value) {
    circleRef.value!.style.backgroundColor = 'skyblue'
    await submit()
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (imageContainer.value) {
    const mouseX = event.clientX
    const mouseY = event.clientY

    const containerRect = imageContainer.value.getBoundingClientRect()
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
  mouseIsInImage.value = false
}

const submit = async () => {
  submitDisabled.value = true
  gameStore.loading = true
  try {
    if (!window.confirm('Are you sure you want to submit this guess?')) {
      return
    }
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
    const res = await web3Service.submitGuess(challengeId, [
      relativeMouseX.value,
      relativeMouseY.value
    ])
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
      class="w-[1000px] mx-auto cursor-pointer relative"
      ref="imageContainer"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    >
      <template v-if="game?.[0]">
        <img :src="game[0]" alt="Spot the ball" class="w-full block" />
      </template>
      <div
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
