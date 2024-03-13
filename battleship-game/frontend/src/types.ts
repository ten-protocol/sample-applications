export type Ship = {
  shipType: string
  name: string
  length: number

  horizontal: boolean
  startX: number
  startY: number
  sunk: boolean
}

export type ShipPosition = {
  shipType: string
  cellIds: string[]
}

export type Message = {
  id: number
  message: string
}
