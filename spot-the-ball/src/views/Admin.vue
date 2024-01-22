<script setup lang="ts">
	import { ref } from "vue";

	interface FileWithPreview extends File {
		preview?: string;
	}

	const selectedFiles = ref<FileWithPreview[]>([]);

	const browseFiles = () => {
		// Trigger the file input click
		fileInput?.value?.click();
	};

	const handleFileChange = () => {
		const files = fileInput?.value?.files;
		if (files && files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i] as FileWithPreview;
				// Set the preview image URL
				file.preview = URL.createObjectURL(file);
				selectedFiles.value.push(file);
			}
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i] as FileWithPreview;
				// Set the preview image URL
				file.preview = URL.createObjectURL(file);
				selectedFiles.value.push(file);
			}
		}
	};

	const fileInput = ref<HTMLInputElement | null>(null);
</script>

<template>
	<div class="w-full flex py-20 justify-center">
		<div class="max-w-[800px] h-fit w-full">
			<div
				@dragover.prevent="handleDragOver"
				@drop.prevent="handleDrop"
				class="p-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-100">
				<div class="input">
					<div
						v-if="!selectedFiles.length"
						class="flex justify-center items-center flex-col gap-4">
						<img
							src="../assets/cloud-upload.png"
							alt=""
							width="40"
							height="40" />
						<p class="font-bold">Drop or Select files</p>
						<p class="text-sm">
							Drop files here or click
							<span
								@click="browseFiles"
								class="text-green-900 font-bold underline cursor-pointer"
								>browse</span
							>
							to upload from your machine
						</p>
					</div>
					<div v-else class="flex justify-center items-center flex-col gap-4">
						<p class="text-sm">
							<span
								@click="browseFiles"
								class="text-green-900 font-bold underline cursor-pointer"
								>Change files</span
							>
						</p>
					</div>
					<input
						ref="fileInput"
						type="file"
						style="display: none"
						@change="handleFileChange"
						multiple />
				</div>
			</div>

			<div v-if="selectedFiles.length" class="w-full mt-4 flex gap-4">
				<div
					v-for="(file, index) in selectedFiles"
					:key="index"
					class="p-6 shadow-xl border rounded-xl mt-2 overflow-hidden">
					<img
						:src="file.preview"
						alt="Selected Preview"
						class="block flex-1" />
				</div>
			</div>
		</div>
	</div>
</template>
