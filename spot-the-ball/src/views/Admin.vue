<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import Topbar from '../components/Topbar.vue'
import Challenge from '../components/Challenge.vue'

const challenges = ref([
  {
    selectedFiles: [],
    position: { x1: 0, x2: 0, y1: 0, y2: 0 }
  }
])

const addChallenge = () => {
  challenges.value.push({
    selectedFiles: [],
    position: { x1: 0, x2: 0, y1: 0, y2: 0 }
  })
}

const removeChallenge = (index) => {
  if (challenges.value.length > 1) {
    challenges.value.splice(index, 1)
  }
}

const addFilessToChallenge = (files, index) => {
  challenges.value[index].selectedFiles = files
}

const addPositionToChallenge = (position, index) => {
  challenges.value[index].position = position
}

async function handleUpload() {
  const gameStore = useGameStore()
  try {
    const createChallengeResp = await gameStore.createChallenge(challenges.value)
    console.log('🚀 ~ handleUpload ~ createChallengeResp:', createChallengeResp)

    // Reset the form
    challenges.value = [
      {
        selectedFiles: [],
        position: { x1: 0, x2: 0, y1: 0, y2: 0 }
      }
    ]
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <Topbar />
    <div class="flex flex-col gap-4 p-4">
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
            !challenges.every(
              (challenge) => challenge.selectedFiles.length && challenge.position.x1
            )
          "
        >
          Create Challenge(s)
        </button>
      </div>
    </div>
  </div>
</template>
