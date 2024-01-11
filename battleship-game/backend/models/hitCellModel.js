const { Schema, model } = require("mongoose");

const hitCellSchema = Schema({
	cell: {
		type: String,
		required: true,
	},
});

const HitCell = model("HitCell", hitCellSchema);

module.exports = HitCell;
