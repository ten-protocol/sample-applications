const { Schema, model } = require("mongoose");

const hitCellSchema = Schema({
  hit: {
    type: Boolean,
    required: true,
  },
  cell: {
    type: String,
    required: true,
  },
});

const HitCell = model("HitCell", hitCellSchema);

module.exports = HitCell;
