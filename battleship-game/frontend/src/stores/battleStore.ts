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
    async getShipProperties() {
      const walletStore = useWalletStore()
      const web3service = new Web3Service(walletStore.signer)
      try {
        const shipTypes = [0, 1, 2]
        const shipsArray = [] as Ship[]
        for (let i = 0; i < shipTypes.length; i++) {
          const ship = await web3service.getShipProperties(shipTypes[i])
          shipsArray.push(ship)
        }
        console.log('🚀 ~ getShipProperties ~ shipsArray:', shipsArray)
        this.ships = shipsArray
      } catch (error) {
        console.error(error)
      }
    },

    async shootCpuShip(cellName: string) {
      const x = Number(cellName?.split('-')[0])
      const y = Number(cellName?.split('-')[1])

      const walletStore = useWalletStore()
      if (!walletStore.signer) {
        return
      }
      console.log('🚀 ~ shootCpuShip ~ cellName:', cellName)
      const web3service = new Web3Service(walletStore.signer)
      try {
        const res = await web3service.submitGuess(x, y)
        console.log('🚀 ~ shootCpuShip ~ res:', res)
      } catch (error) {
        console.error(error)
      }
      // await battleship.saveHitCell(hitCell)

      // const res = await battleship.saveMessage({ message })

      // this.addMessage(res)

      //   await battleship.saveHitShip({ ship: shipPart })

      //   this.cpuHitShips.push(shipPart)

      //   ships.forEach(async (ship) => {
      //     const count = this.cpuHitShips.filter((shipType) => shipType === ship.shipType).length
      //     if (count === ship.length) {
      //       if (this.cpuSunkShips.some((x) => x.shipType === ship.shipType)) {
      //         return
      //       }
      //       const newShip = {
      //         shipType: ship.shipType,
      //         name: ship.name,
      //         length: ship.length
      //       }
      //       await battleship.saveSunkShip(newShip)
      //       this.cpuSunkShips.push(newShip)
      //     }
      //   })
      // } else {
      //   cell?.classList.add('miss')
      //   const hitCell = { hit: false, cell: cell!.id }

      //   await battleship.saveHitCell(hitCell)
      // }
    },

    async getHitCells() {
      const res = await battleship.getHitCells()
      const hits = res.filter((cell) => cell.hit === true)
      const hitCells = hits.map((cell) => document.getElementById(cell.cell)!)
      const misses = res.filter((cell) => cell.hit === false)
      const missedCells = misses.map((cell) => document.getElementById(cell.cell)!)

      hitCells.forEach((cell) => cell.classList.add('boom'))

      missedCells.forEach((cell) => cell.classList.add('miss'))
    },

    async getHitShips() {
      const res = await battleship.getHitShips()
      this.cpuHitShips = res
    },

    async getSunkShips() {
      const res = await battleship.getSunkShips()
      this.cpuSunkShips = res
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
