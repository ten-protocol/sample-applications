export type Challenge = {
  selectedFiles: any[]
  position: {
    x1: number
    x2: number
    y1: number
    y2: number
    center: {
      x: number
      y: number
    }
  }
}

export type FormattedChallenge = {
  publicImageURL: string
  privateImageURL: string
  topLeft: number[]
  bottomRight: number[]
  centerPoint: number[]
}

export type Message = {
  id: number
  text: string
}

export type Game = {
  transactionHash: string
  win: boolean
  x: number
  y: number
  timestamp: string
}

export type PreviousWins = {
  name: string
  topGuessesArray: {
    guesser: string
    distance: number
  }[]
  privateImageURL: string
}
