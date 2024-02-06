export type Challenge = {
  selectedFiles: any[]
  position: {
    x1: number
    x2: number
    y1: number
    y2: number
  }
}

export type FormattedChallenge = {
  publicImageURL: string
  privateImageURL: string
  topLeft: number[]
  bottomRight: number[]
}

export type Message = {
  id: number
  text: string
}
