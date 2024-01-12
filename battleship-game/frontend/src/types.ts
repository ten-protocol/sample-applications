export type Ship = {
  shipType: string
  name: string
  length: number
  imageX?: string
  imageY?: string
}

export type ShipPosition = {
  shipType: string
  cellIds: string[]
}

export type Message = {
  id: number
  message: string
}
