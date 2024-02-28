<template>
  <div>
    <AdminHeader />
    <div class="flex flex-col gap-4 p-4">
      <button class="hidden" @click="addAdmin">Add admin</button>
      <Challenge
        v-for="(challenge, index) in challenges"
        :key="index"
        :index="index"
        :challenge="challenge"
        @remove="removeChallenge(index)"
        @fileChange="addFilessToChallenge($event, index)"
        @positionChange="addPositionToChallenge($event, index)"
      />

      <div class="space-x-4 flex justify-end">
        <button class="py-4 px-6 rounded-lg bg-grey-900 text-dark" @click="addChallenge">
          Add another challenge
        </button>
        <button
          class="py-4 px-6 rounded-lg bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleUpload"
          :disabled="
            challenges.some(
              (challenge) => challenge.selectedFiles.length === 0 || challenge.position.x1 === 0
            )
          "
        >
          Create Challenge(s)
        </button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import Challenge from '../components/Challenge.vue'
import AdminHeader from '../components/AdminHeader.vue'
import Web3Service from '../lib/web3service'
import { useWalletStore } from '../stores/walletStore'

const challenges = ref([
  {
    selectedFiles: [],
    position: { x1: 0, x2: 0, y1: 0, y2: 0, center: { x: 0, y: 0 } }
  }
])

const addChallenge = () => {
  challenges.value.push({
    selectedFiles: [],
    position: { x1: 0, x2: 0, y1: 0, y2: 0, center: { x: 0, y: 0 } }
  })
}

const removeChallenge = (index) => {
  if (challenges.value.length > 1) {
    return challenges.value.splice(index, 1)
  }
  return (challenges.value[0] = {
    selectedFiles: [],
    position: { x1: 0, x2: 0, y1: 0, y2: 0, center: { x: 0, y: 0 } }
  })
}

const addFilessToChallenge = (files, index) => {
  challenges.value[index].selectedFiles = files
}

const addPositionToChallenge = (position, index) => {
  const centerX = (position.x1 + position.x2) / 2
  const centerY = (position.y1 + position.y2) / 2

  challenges.value[index].position = {
    ...position,
    center: { x: centerX, y: centerY }
  }
}

const addAdmin = async () => {
  const walletStore = useWalletStore()
  const web3Service = new Web3Service(walletStore.signer)
  const address = ''
  const res = await web3Service.addAdmin(address)
  return res
}

async function handleUpload() {
  const gameStore = useGameStore()
  gameStore.loading = true
  try {
    const createChallengeResp = await gameStore.createChallenge(challenges.value)
    gameStore.showModal(
      'Success',
      'The following challenge(s) have been created: ' +
        createChallengeResp.map((c) => c.transactionHash).join(', ')
    )

    challenges.value = [
      {
        selectedFiles: [],
        position: { x1: 0, x2: 0, y1: 0, y2: 0, center: { x: 0, y: 0 } }
      }
    ]
  } catch (error) {
    console.error(error)
  } finally {
    gameStore.loading = false
  }
}
</script>
