import { Ship } from '../types'

export const COLUMN_LABELS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export const ROW_LABELS: string[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

function formatAddress(address: string) {
  const afterX = address.substring(2)
  const firstFourCharacters = afterX.substring(0, 4)
  const lastFourCharacters = afterX.slice(-4)

  return `0x${firstFourCharacters}...${lastFourCharacters}`
}

export const PLAYER_ID: string = formatAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')

export const WIDTH: number = 100

export const CELL_WIDTH = 20

export const GRID_WIDTH: number = WIDTH * CELL_WIDTH

function generateGridArray(rows: number, columns: number) {
  const result: string[] = []

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= columns; col++) {
      result.push(`${col}-${row}`)
    }
  }

  return result
}

export const CELLS: string[] = generateGridArray(WIDTH, WIDTH)

export const BATTLESHIPS: Ship[] = [
  {
    shipType: 'battleship',
    name: 'Battleship',
    length: 4
  },
  {
    shipType: 'submarine',
    name: 'Submarine',
    length: 3
  },
  {
    shipType: 'cruiser',
    name: 'Cruiser',
    length: 2
  },
  {
    shipType: 'carrier',
    name: 'Aircraft Carrier',
    length: 5
  },
  {
    shipType: 'destroyer',
    name: 'Destroyer',
    length: 3
  }
]

export const BASE_URL =
  process.env.VUE_APP_API_HOST || 'http://battleship-game-api.uksouth.azurecontainer.io'
