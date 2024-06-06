import { defineStore } from 'pinia'
import { Ship, ShipPosition } from '../types'
import { PLAYER_ID } from '../lib/constants'
import battleship from '../services/battleship'
import { useWalletStore } from '../stores/walletStore'
import Web3Service from '../lib/web3service.js'

const shipLength = 3
const totalShips = 249

export const useBattleStore = defineStore('battleStore', {
  state: () => ({
    playerId: PLAYER_ID as string,
    zoom: 1 as number,
    gridSize: 100,
    ships: [],
    hits: [],
    graveyard: new Array(totalShips).fill(false),
    sunkShipsCount: 0,
    gameOver: false
  }),

  // getters: {
  //   isCellHit: (state) => (x: number, y: number) => !!state.hits[`${x},${y}`],
  //   isShipSunk: (state) => (shipIndex: number) => state.graveyard[shipIndex]
  // },

  actions: {
    async getAllShipPositions() {
      const walletStore = useWalletStore()
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.getAllShipPositions()
        this.ships = res
      } catch (error) {
        console.error(error)
      }
    },

    async getGraveyard() {
      const walletStore = useWalletStore()
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.getGraveyard()
        this.ships = res
      } catch (error) {
        console.error(error)
      }
    },

    async shootCpuShip(x: number, y: number) {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      console.log('🚀 ~ shootCpuShip ~ cellName:', x, y)
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.submitGuess(x, y)
        console.log('🚀 ~ shootCpuShip ~ res:', res)
        return res
      } catch (error) {
        console.error(error)
      }
    },

    async isCellHit(x: number, y: number) {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      const web3service = new Web3Service(walletStore.signer)
      const res = await web3service.isCellHit(x, y)
      return res
    },

    async getHits() {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      const web3service = new Web3Service(walletStore.signer)
      try {
        setInterval(async () => {
          const hits = await web3service.getHits()
          this.hits = hits
        }, 5000)
      } catch (error) {
        throw error
      }
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
