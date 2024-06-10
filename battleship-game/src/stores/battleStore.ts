import { defineStore } from 'pinia'
import { PLAYER_ID } from '../lib/constants'
import { useWalletStore } from '../stores/walletStore'
import Web3Service from '../lib/web3service.js'

const totalShips = 249

export const useBattleStore = defineStore('battleStore', {
  state: () => ({
    playerId: PLAYER_ID as string,
    zoom: 1 as number,
    gridSize: 100,
    ships: [],
    hitsMap: [],
    graveyard: new Array(totalShips).fill(false),
    sunkShipsCount: 0,
    gameOver: false
  }),

  actions: {
    async getAllShipPositions() {
      const walletStore = useWalletStore()
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.getAllShipPositions()
        this.ships = res
      } catch (error) {
        console.error(error)
        throw new Error('Failed to get all ship positions')
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
        throw new Error('Failed to get graveyard')
      }
    },

    async shootCpuShip(x: number, y: number) {
      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.submitGuess(x, y)
        return res
      } catch (error) {
        console.error(error)
        throw new Error('Failed to make a guess')
      }
    },

    setHits(hits: any) {
      this.hitsMap = hits
    },

    setGraveyard(graveyard: any) {
      this.graveyard = graveyard
    },

    setSunkShipsCount(count: number) {
      this.sunkShipsCount = count
    },

    zoomBattleGrid(action: string) {
      if (action === 'add') {
        this.zoom++
        console.log(this.zoom)
      } else {
        this.zoom--
        console.log(this.zoom)
      }
    }
  }
})
