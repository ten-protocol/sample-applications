const express = require('express')
const router = express.Router()
const {
  saveShipPos,
  getShipPos,
  saveHitCell,
  getHitCells,
  saveHitShip,
  getHitShips,
  saveSunkShip,
  getSunkShips,
  saveMessage,
  getMessages
} = require('../controllers/battleshipController')

router.post('/saveShipPos', saveShipPos)
router.get('/getShipPos', getShipPos)
router.post('/saveHitCell', saveHitCell)
router.get('/getHitCells', getHitCells)
router.post('/saveHitShip', saveHitShip)
router.get('/getHitShips', getHitShips)
router.post('/saveSunkShip', saveSunkShip)
router.get('/getSunkShips', getSunkShips)
router.post('/saveMessage', saveMessage)
router.get('/getMessages', getMessages)

module.exports = router
