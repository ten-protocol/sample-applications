<script setup lang="ts">
	import { Ref, inject, onMounted, ref, watch } from "vue";
	import battleships from "../data/battleships";
	import { Ship } from "../types";
	import labels from "../data/labels";
	import { useMessageStore } from "../store/messageStore";

	defineProps<{
		user: "player" | "cpu";
	}>();

	const {
		angle,
		width,
		takenBlocks,
		shipsAfloat,
		cpuHitShips,
		cpuSunkShips,
		playerHitShips,
		playerSunkShips,
		turn,
		gameOver,
	} = inject("store") as {
		angle: Ref<number>;
		width: Ref<number>;
		takenBlocks: Ref<string[]>;
		shipsAfloat: Ref<string[]>;
		info: Ref<string>;
		cpuHitShips: Ref<string[]>;
		playerHitShips: Ref<string[]>;
		cpuSunkShips: Ref<Ship[]>;
		playerSunkShips: Ref<Ship[]>;
		turn: Ref<string>;
		gameOver: Ref<boolean>;
	};

	const cpuBlockRef = ref<HTMLElement | null>(null);
	const playerBlockRef = ref<HTMLElement | null>(null);
	const messageStore = useMessageStore();

	function addCpuShipPiece(ship: Ship) {
		const blockWidth = width.value;
		const allBoardBlocks = cpuBlockRef;
		let randomBool = Math.random() < 0.5;
		let isHorizontal = randomBool;
		let randomStartIndex = Math.floor(Math.random() * blockWidth * blockWidth);
		let validStart = isHorizontal
			? randomStartIndex <= blockWidth * blockWidth - ship.length
				? randomStartIndex
				: blockWidth * blockWidth - ship.length
			: //   handle vertical
			randomStartIndex <= blockWidth * blockWidth - blockWidth * ship.length
			? randomStartIndex
			: randomStartIndex - ship.length * blockWidth + blockWidth;
		let shipBlocks: HTMLElement[] = [];
		let valid: boolean;

		if (allBoardBlocks.value) {
			for (let i = 0; i < ship.length; i++) {
				if (isHorizontal) {
					shipBlocks.push(allBoardBlocks.value[validStart + i]);
				} else {
					shipBlocks.push(allBoardBlocks.value[validStart + i * blockWidth]);
				}
			}

			if (isHorizontal) {
				valid = shipBlocks.every(
					(_shipBlock, index) =>
						Number(shipBlocks[0].id) % blockWidth !==
						blockWidth - (shipBlocks.length - (index + 1))
				);
			} else {
				valid = shipBlocks.every(
					(_shipBlock, index) =>
						Number(shipBlocks[0].id) < 90 + (blockWidth * index + 1)
				);
			}

			const notTaken = shipBlocks.every(
				(shipBlock) => !shipBlock.classList.contains("taken")
			);

			if (notTaken) {
				shipBlocks.forEach((shipBlock) => {
					shipBlock.classList.add(ship.shipType);
					shipBlock.classList.add("taken");
				});
			} else {
				addCpuShipPiece(ship);
			}
		}
	}

	function dragOver(e: DragEvent) {
		e.preventDefault();
	}

	function dropShip(e: DragEvent, i: string) {
		e.preventDefault();
		const data = e.dataTransfer?.getData("text") ?? "";

		if (takenBlocks.value.includes(i)) {
			return;
		}

		if (data && e.target instanceof HTMLElement) {
			const draggedShipElement = document.getElementById(
				data
			) as HTMLElement | null;
			// if (draggedShipElement) {
			// 	e.target.appendChild(draggedShipElement);
			// }
			const startId = Number(e.target.id);
			const ship = battleships.find((ship) => ship.shipType === data);
			let shipBlockIds: string[] = [];
			let shipBlockElements: HTMLElement[] = [];

			if (ship) {
				const isVertical = angle.value === 90;

				for (let i = 0; i < ship.length; i++) {
					const currentId = isVertical
						? startId + i * width.value
						: startId + i;

					shipBlockIds.push(String(currentId));
				}
			}

			shipBlockIds.forEach((blockId) => {
				const block = document.getElementById(blockId);
				takenBlocks.value.push(blockId);
				if (block) {
					shipBlockElements.push(block);
				}
			});

			if (ship) {
				shipsAfloat.value.push(ship.shipType);

				shipBlockElements.forEach((block) => {
					block.classList.add("taken");
					block.classList.add(ship?.shipType);
					block.classList.add("player-ship");
					draggedShipElement?.remove();
				});
			}
		}
	}

	function playerTurn(i: string) {
		if (cpuBlockRef.value) {
			const cpuBlocks = Array.from(cpuBlockRef.value as any) as HTMLElement[];

			cpuBlocks.forEach((block) => block.classList.add("disabled"));
			const block = cpuBlocks.find((block) => block.id === i);

			if (block?.classList.contains("boom")) {
				return;
			}

			turn.value = "cpu";
			messageStore.addMessage({
				id: Date.now(),
				message: "Cpu turn.",
			});

			if (block?.classList.contains("taken")) {
				block?.classList.add("boom");
				const shipPart = Array.from(block.classList)
					.map((x) => battleships.filter((ship) => ship.shipType === x))
					.filter((subArr) => subArr.length > 0)
					.map((subArray) => subArray[0].shipType)[0];

				cpuHitShips.value.push(shipPart);

				battleships.forEach((ship) => {
					const count = cpuHitShips.value.filter(
						(shipType) => shipType === ship.shipType
					).length;
					if (count === ship.length) {
						if (cpuSunkShips.value.some((x) => x.shipType === ship.shipType)) {
							return;
						}
						cpuSunkShips.value.push(ship);

						console.log(cpuSunkShips.value);
					}
				});

				messageStore.addMessage({
					id: Date.now(),
					message: "You hit the computer's ship!",
				});
			} else {
				block?.classList.add("miss");
				messageStore.addMessage({
					id: Date.now(),
					message: "Ouch! Miss!!",
				});
			}
		}
	}

	function cpuTurn() {
		const blockWidth = width.value;
		if (cpuBlockRef.value) {
			const cpuBlocks = Array.from(cpuBlockRef.value as any) as HTMLElement[];
			cpuBlocks.forEach((block) => block.classList.remove("disabled"));
		}

		if (playerBlockRef.value) {
			const playerBlocks = Array.from(
				playerBlockRef.value as any
			) as HTMLElement[];

			let randomStartIndex = Math.floor(
				Math.random() * blockWidth * blockWidth
			);
			const block = playerBlocks.find(
				(block) => block.id === String(randomStartIndex)
			);

			// if (block?.classList.contains("miss")) {
			// 	cpuTurn();
			// }
			turn.value = "player";
			messageStore.addMessage({
				id: Date.now(),
				message: "Your turn.",
			});

			if (block?.classList.contains("boom")) {
				return;
			}

			if (block?.classList.contains("taken")) {
				block?.classList.add("boom");
				const shipPart = Array.from(block.classList)
					.map((x) => battleships.filter((ship) => ship.shipType === x))
					.filter((subArr) => subArr.length > 0)
					.map((subArray) => subArray[0].shipType)[0];

				playerHitShips.value.push(shipPart);

				battleships.forEach((ship) => {
					const count = playerHitShips.value.filter(
						(shipType) => shipType === ship.shipType
					).length;
					if (count === ship.length) {
						if (
							playerSunkShips.value.some((x) => x.shipType === ship.shipType)
						) {
							return;
						}
						playerSunkShips.value.push(ship);

						console.log(playerSunkShips.value);
					}
				});

				messageStore.addMessage({
					id: Date.now(),
					message: "Computer hit your ship",
				});
			} else {
				block?.classList.add("miss");
				messageStore.addMessage({
					id: Date.now(),
					message: "Ouch! Miss!!",
				});
			}
		}
	}

	watch(
		() => shipsAfloat,
		(newValue, oldValue) => {
			if (newValue.value.length === 5) {
				messageStore.addMessage({
					id: Date.now(),
					message: "Fire away!!",
				});
			}
		},
		{ deep: true }
	);

	watch(
		() => cpuSunkShips,
		(newValue, oldValue) => {
			if (newValue.value.length === 5) {
				messageStore.addMessage({
					id: Date.now(),
					message: "You won!! 🎉",
				});
				setTimeout(() => {
					gameOver.value = true;
				}, 2000);
			}
		},
		{ deep: true }
	);

	watch(
		() => playerSunkShips,
		(newValue, oldValue) => {
			if (newValue.value.length === 5) {
				messageStore.addMessage({
					id: Date.now(),
					message: "Compter won!!",
				});
				setTimeout(() => {
					gameOver.value = true;
				}, 2000);
			}
		},
		{ deep: true }
	);

	watch([turn, gameOver], ([newTurn, newGameOver], [oldTurn, oldGameOver]) => {
		if (newGameOver) {
			return;
		}

		if (newTurn === "cpu") {
			setTimeout(() => {
				cpuTurn();
			}, 2000);
		}
	});

	onMounted(() => {
		battleships.forEach((ship) => addCpuShipPiece(ship));
	});
</script>

<template>
	<div class="relative flex mt-4">
		<div class="w-fit grid grid-cols-10 absolute top-0 right-0">
			<div
				class="w-[30px] min-[480px]:w-[40px] h-[30px] min-[480px]:h-[40px] flex items-center justify-center rounded-[4px] border-2 border-white text-gray-dark text-center text-[12px] min-[480px]:text-[16px] font-bold tracking-[0.8px]"
				v-for="label in labels.columnLabels"
				:key="label"
				:id="label"
				:text="label">
				{{ label }}
			</div>
		</div>

		<div class="w-fit grid grid-cols-1">
			<div
				class="w-[30px] min-[480px]:w-[40px] h-[30px] min-[480px]:h-[40px] flex items-center justify-center rounded-[4px] border-2 border-white text-gray-dark text-center text-[12px] min-[480px]:text-[16px] font-bold tracking-[0.8px]"
				v-for="label in labels.rowLabels"
				:key="label"
				:id="`${label}-label`"
				:text="label">
				{{ label }}
			</div>
		</div>

		<div
			:id="user"
			:class="`flex-1 grid grid-cols-10 mt-[40px] ${
				user === 'player' ? 'bg-aqua' : 'bg-gray-light'
			}`">
			<div
				v-for="i in width * width"
				:key="String(i)"
				:id="String(i)"
				:class="`w-[30px] min-[480px]:w-[40px] h-[30px] min-[480px]:h-[40px] flex items-center justify-center border border-white`"
				:ref="user === 'player' ? 'playerBlockRef' : 'cpuBlockRef'"
				@drop="user === 'player' && dropShip($event, String(i))"
				@dragover="user === 'player' && dragOver($event)"
				@click="playerTurn(String(i))"></div>
		</div>

		<div
			v-if="user === 'cpu' && shipsAfloat.length !== 5"
			class="absolute w-full h-full top-0 left-0 z-10"
			@click="
				messageStore.addMessage({
					id: Date.now(),
					message: 'Please add all your battleships to the board.',
				})
			"></div>
	</div>
</template>
