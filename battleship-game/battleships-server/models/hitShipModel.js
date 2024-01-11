const { Schema, model } = require("mongoose");

const hitShipSchema = Schema({
	ship: {
		type: String,
		required: true,
	},
});

const HitShip = model("HitShip", hitShipSchema);

module.exports = HitShip;
