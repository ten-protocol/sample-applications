import { Ship } from '../types'

export const COLUMN_LABELS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export const ROW_LABELS: string[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

function generateStringArray() {
  const result: string[] = []

  for (let row = 1; row <= 10; row++) {
    for (let col = 'A'.charCodeAt(0); col <= 'J'.charCodeAt(0); col++) {
      result.push(String.fromCharCode(col) + row)
    }
  }

  return result
}

export const CELLS: string[] = generateStringArray()

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
    name: 'Cruier',
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

export const WIDTH: number = 10

export const BASE_URL = 'http://localhost:4000'
