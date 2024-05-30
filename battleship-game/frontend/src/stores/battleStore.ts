import { defineStore } from 'pinia'
import { Ship, ShipPosition } from '../types'
import { PLAYER_ID } from '../lib/constants'
import battleship from '../services/battleship'
import { useWalletStore } from '../stores/walletStore'
import Web3Service from '../lib/web3service.js'

export const useBattleStore = defineStore('battleStore', {
  state: () => ({
    playerId: PLAYER_ID as string,
    angle: 0 as number,
    cpuShipPositions: [] as ShipPosition[],
    cpuHitShips: [] as string[],
    cpuSunkShips: [] as Ship[],
    zoom: 1 as number,
    ships: [] as Ship[]
  }),

  getters: {},

  actions: {
    async getAllShipPositions() {
      const walletStore = useWalletStore()
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.getAllShipPositions()
        this.cpuShipPositions = res
      } catch (error) {
        console.error(error)
      }
    },

    async shootCpuShip(cellName: string) {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      console.log('🚀 ~ shootCpuShip ~ cellName:', cellName)
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.submitGuess(cellName[0], cellName[1])
        console.log('🚀 ~ shootCpuShip ~ res:', res)
        return res
      } catch (error) {
        console.error(error)
      }
    },

    async isCellHit(x: string, y: string) {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      const web3service = new Web3Service(walletStore.signer)
      const res = await web3service.isCellHit(x, y)
      return res
    },

    async isShipSunk(shipIndex: number) {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      const web3service = new Web3Service(walletStore.signer)
      const res = await web3service.isShipSunk(shipIndex)
      return res
    },

    zoomBattleGrid(action: string) {
      if (action === 'add') {
        this.zoom++
        console.log(this.zoom)
      } else {
        this.zoom--
        console.log(this.zoom)
      }
    },

    async resetGame() {
      await battleship.resetGame()

      this.cpuShipPositions = []
      this.cpuHitShips = []
      this.cpuSunkShips = []
      this.messages = []
      this.zoom = 1

      window.location.reload()
    }
  }
})
