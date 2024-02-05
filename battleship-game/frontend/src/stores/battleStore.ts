import { defineStore } from 'pinia'
import { Ship, ShipPosition } from '../types'
import { PLAYER_ID, WIDTH } from '../lib/constants'
import battleship from '../services/battleship'

export const useBattleStore = defineStore('battleStore', {
  state: () => ({
    playerId: PLAYER_ID as string,
    angle: 0 as number,
    cpuShipPositions: [] as ShipPosition[],
    cpuHitShips: [] as string[],
    cpuSunkShips: [] as Ship[],
    zoom: 1 as number
  }),

  getters: {},

  actions: {
    async addCpuShip(ship: Ship, cells: HTMLElement[]) {
      let isHorizontal = Math.random() < 0.5
      let validStart: number
      let shipCells: HTMLElement[] = []
      let valid: boolean

      await this.getCpuShipPos()

      if (this.cpuShipPositions.length === 5) {
        const shipCellIds = this.cpuShipPositions.find((x) => x.shipType === ship.shipType).cellIds
        const savedShipCells = shipCellIds.map((id) => document.getElementById(id)!)

        shipCells = savedShipCells

        shipCells.forEach((cell) => {
          cell.classList.add(ship.shipType)
          cell.classList.add('taken')
        })

        return
      }

      if (isHorizontal) {
        validStart = Math.floor(Math.random() * (WIDTH - ship.length + 1)) * WIDTH
      } else {
        validStart =
          Math.floor(Math.random() * WIDTH) +
          Math.floor(Math.random() * (WIDTH - ship.length + 1)) * WIDTH
      }

      for (let i = 0; i < ship.length; i++) {
        shipCells.push(cells[validStart + (isHorizontal ? i : i * WIDTH)])
      }

      if (isHorizontal) {
        valid = shipCells.every(
          (_shipBlock, index) =>
            Math.floor(Number(shipCells[0].id) / WIDTH) ===
            Math.floor((Number(shipCells[0].id) + index) / WIDTH)
        )
      } else {
        valid = shipCells.every(
          (_shipBlock, index) =>
            Number(shipCells[0].id) < WIDTH * WIDTH - WIDTH + (WIDTH * index + 1)
        )
      }

      const notTaken = shipCells.every((cell) => !cell.classList.contains('taken'))

      if (notTaken && valid) {
        shipCells.forEach((cell) => {
          cell.classList.add(ship.shipType)
          cell.classList.add('taken')
        })
        const shipPos: ShipPosition = {
          shipType: ship.shipType,
          cellIds: shipCells.map((cell) => cell.id)
        }

        this.cpuShipPositions.push(shipPos)
        await battleship.saveShipPos(shipPos)
      } else {
        this.addCpuShip(ship, cells)
      }
    },

    async getCpuShipPos() {
      const res = await battleship.getShipPos()
      this.cpuShipPositions = res
    },

    async shootCpuShip(i: string, cells: HTMLElement[], ships: Ship[]) {
      const cell = cells.find((cell) => cell.id === String(i))

      if (cell?.classList.contains('boom')) {
        return
      }
      if (cell?.classList.contains('taken')) {
        cell?.classList.add('boom')
        const shipPart = Array.from(cell.classList)
          .map((x) => ships.filter((ship) => ship.shipType === x))
          .filter((subArr) => subArr.length > 0)
          .map((subArray) => subArray[0].shipType)[0]

        const cellName = cell.classList[0]
        const message = `Player ${this.playerId} hit a ship on cell ${cellName}`
        const hitCell = { hit: true, cell: cell!.id }

        await battleship.saveHitCell(hitCell)

        const res = await battleship.saveMessage({ message })

        this.addMessage(res)

        await battleship.saveHitShip({ ship: shipPart })

        this.cpuHitShips.push(shipPart)

        ships.forEach(async (ship) => {
          const count = this.cpuHitShips.filter((shipType) => shipType === ship.shipType).length
          if (count === ship.length) {
            if (this.cpuSunkShips.some((x) => x.shipType === ship.shipType)) {
              return
            }
            const newShip = {
              shipType: ship.shipType,
              name: ship.name,
              length: ship.length
            }
            await battleship.saveSunkShip(newShip)
            this.cpuSunkShips.push(newShip)
          }
        })
      } else {
        cell?.classList.add('miss')
        const hitCell = { hit: false, cell: cell!.id }

        await battleship.saveHitCell(hitCell)
      }
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
