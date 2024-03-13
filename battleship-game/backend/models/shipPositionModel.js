const { Schema, model } = require('mongoose')

const ShipPositionSchema = Schema({
  shipType: {
    type: String,
    required: true
  },
  cellIds: {
    type: [String],
    required: true
  }
})

const ShipPosition = model('ShipPosition', ShipPositionSchema)

module.exports = ShipPosition
