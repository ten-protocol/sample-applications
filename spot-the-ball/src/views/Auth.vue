<script setup lang="ts">
	import router from "../router";

	const handleLogin = (e: any) => {
		e.preventDefault();

		router.push("/admin");
	};
</script>

<template>
	<div class="w-full h-screen flex items-center justify-center">
		<form
			class="max-w-[400px] w-full flex flex-col gap-4"
			@submit="handleLogin">
			<div class="flex flex-col gap-2">
				<label class="text-[14px] font-semibold text-neutral-900"
					>Enter code:</label
				>
				<input
					type="text"
					class="p-4 h-[44px] rounded-lg border border-neutral-800" />
			</div>
			<button
				class="bg-slate-900 text-white rounded-lg py-2 px-6 text-[14px] h-[44px]">
				Login
			</button>
		</form>
	</div>
</template>
