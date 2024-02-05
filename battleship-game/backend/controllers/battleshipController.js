const ShipPosition = require('../models/shipPositionModel')
const HitCell = require('../models/hitCellModel')
const HitShip = require('../models/hitShipModel')
const SunkShip = require('../models/sunkShipModel')
const Message = require('../models/messageModel')

const saveShipPos = async (req, res) => {
  const { shipType, cellIds } = req.body

  try {
    const savedShipPosition = await ShipPosition.create({
      shipType,
      cellIds
    })

    res.status(201).json(savedShipPosition)
  } catch (error) {
    console.error('Error saving shipPositions:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getShipPos = async (req, res) => {
  try {
    const shipPositions = await ShipPosition.find()
    res.status(200).json(
      shipPositions.map((pos) => {
        return {
          shipType: pos.shipType,
          cellIds: pos.cellIds
        }
      })
    )
  } catch (error) {
    console.error('Error getting shipPositions:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const saveHitCell = async (req, res) => {
  const { hit, cell } = req.body

  try {
    const savedCell = await HitCell.create({ hit, cell })
    res.status(201).json(savedCell)
  } catch (error) {
    console.error('Error saving hit cell:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getHitCells = async (req, res) => {
  try {
    const hitCells = await HitCell.find()
    res.status(200).json(
      hitCells.map((cell) => {
        return {
          hit: cell.hit,
          cell: cell.cell
        }
      })
    )
  } catch (error) {
    console.error('Error getting hit cells:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const saveHitShip = async (req, res) => {
  const { ship } = req.body

  try {
    const savedShip = await HitShip.create({ ship })
    res.status(201).json(savedShip)
  } catch (error) {
    console.error('Error saving hit cell:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getHitShips = async (req, res) => {
  try {
    const hitShips = await HitShip.find()
    res.status(200).json(
      hitShips.map((ship) => {
        return ship.ship
      })
    )
  } catch (error) {
    console.error('Error getting hit cells:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const saveSunkShip = async (req, res) => {
  const { shipType, name, length } = req.body

  try {
    const sunkShip = await SunkShip.create({ shipType, name, length })
    res.status(201).json(sunkShip)
  } catch (error) {
    console.error('Error saving hit cell:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getSunkShips = async (req, res) => {
  try {
    const sunkShips = await SunkShip.find()
    res.status(200).json(
      sunkShips.map((ship) => {
        return {
          shipType: ship.shipType,
          name: ship.name,
          length: ship.length
        }
      })
    )
  } catch (error) {
    console.error('Error getting hit cells:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const saveMessage = async (req, res) => {
  const { message } = req.body

  try {
    const messageObj = await Message.create({ message })
    res.status(201).json(messageObj)
  } catch (error) {
    console.error('Error saving hit cell:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
    res.status(200).json(
      messages.map((message) => {
        return {
          id: message.id,
          message: message.message
        }
      })
    )
  } catch (error) {
    console.error('Error getting hit cells:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const resetGame = async (req, res) => {
  try {
    await ShipPosition.deleteMany({})
    await HitCell.deleteMany({})
    await HitShip.deleteMany({})
    await SunkShip.deleteMany({})
    await Message.deleteMany({})

    res.status(200).send('Game reset')
  } catch (error) {
    console.error('Error resetting game:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  saveShipPos,
  getShipPos,
  saveHitCell,
  getHitCells,
  saveHitShip,
  getHitShips,
  saveSunkShip,
  getSunkShips,
  saveMessage,
  getMessages,
  resetGame
}
