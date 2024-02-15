<script setup lang="ts">
import { ref } from 'vue'

interface FileWithPreview extends File {
  preview?: string
}

defineProps({
  challenge: Object,
  removeChallenge: Function,
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits()

const fileInput = ref<HTMLInputElement | null>(null)
const selectCoordinates = ref(false)
const selectedFiles = ref<FileWithPreview[]>([])
const position = ref({ x1: 0, x2: 0, y1: 0, y2: 0 })
let isDragging = false
let lastMousePosition = { x1: 0, y1: 0 }

const browseFiles = () => {
  fileInput?.value?.click()
}

const handleFileChange = () => {
  const files = fileInput?.value?.files
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onload = (e: any) => {
        const fileContents = e.target.result
        //@ts-ignore
        file.preview = URL.createObjectURL(file)
        const base64Contents = btoa(fileContents)
        //@ts-ignore
        file.contents = base64Contents
        selectedFiles.value.push(file)
      }

      reader.readAsBinaryString(file)
    }
  }
  emit('fileChange', selectedFiles.value)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as FileWithPreview
      // set preview image URL
      file.preview = URL.createObjectURL(file)
      selectedFiles.value.push(file)
    }
  }
}

function startDrag(event) {
  isDragging = true
  lastMousePosition = getMousePosition(event)
}

function handleDrag(event) {
  if (!isDragging) return

  const currentMousePosition = getMousePosition(event)

  const deltaX = currentMousePosition.x1 - lastMousePosition.x1
  const deltaY = currentMousePosition.y1 - lastMousePosition.y1

  position.value.x1 += deltaX
  position.value.x2 = position.value.x1 + 90
  position.value.y1 += deltaY
  position.value.y2 = position.value.y1 + 90

  lastMousePosition = currentMousePosition

  emit('positionChange', position.value)
}

function stopDrag() {
  isDragging = false
}

function getMousePosition(event) {
  return {
    x1: event.clientX || event.touches[0].clientX,
    y1: event.clientY || event.touches[0].clientY
  }
}
</script>

<template>
  <details class="bg-gray-100 rounded-lg p-4">
    <summary class="cursor-pointer">Challenge {{ index + 1 }}</summary>

    <div class="flex justify-end">
      <button
        @click="index > 1 ? emit('remove') : (selectedFiles = [])"
        class="text-red-900 font-bold underline cursor-pointer"
      >
        Remove
      </button>
    </div>
    <div class="w-full flex py-20 justify-center">
      <div class="max-w-[800px] h-fit w-full">
        <div
          @dragover.prevent="handleDragOver"
          @drop.prevent="handleDrop"
          class="p-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-100"
          v-if="selectedFiles.length < 2"
        >
          <div class="input">
            <div
              v-if="!selectedFiles.length"
              class="flex justify-center items-center flex-col gap-4"
            >
              <img src="../assets/cloud-upload.png" alt="" width="40" height="40" />
              <p class="font-bold">Drop or Select files</p>
              <p class="text-sm">
                Drop files here or click
                <span @click="browseFiles" class="text-green-900 font-bold underline cursor-pointer"
                  >browse</span
                >
                to upload from your machine
              </p>
            </div>
            <div v-else class="flex justify-center items-center flex-col gap-4">
              <img src="../assets/cloud-upload.png" alt="" width="40" height="40" />
              <p class="text-sm">
                <span @click="browseFiles" class="text-green-900 font-bold underline cursor-pointer"
                  >Add files</span
                >
              </p>
            </div>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              @change="handleFileChange"
              multiple
            />
          </div>
        </div>

        <div v-if="selectedFiles.length">
          <div class="mt-4">
            <button
              class="py-2 px-6 rounded-lg bg-neutral-900 text-white"
              @click="selectCoordinates = true"
            >
              Select Coordinates
            </button>
          </div>

          <div class="w-full mt-4 flex flex-col gap-4">
            <div v-for="(file, index) in selectedFiles" :key="index" class="w-full relative">
              <img :src="file.preview" alt="Selected Preview" class="w-full block" />

              <div class="w-full h-full absolute top-0 left-0">
                <div
                  @mousedown="startDrag"
                  @mousemove="handleDrag"
                  @mouseup="stopDrag"
                  @touchstart="startDrag"
                  @touchmove="handleDrag"
                  @touchend="stopDrag"
                  v-if="selectCoordinates && index === 0"
                  class="w-[90px] h-[90px] border-[4px] border-white rounded-full cursor-grab"
                  :style="{
                    transform: `translate(${position.x1}px, ${position.y1}px)`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>

