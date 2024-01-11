const { Schema, model } = require("mongoose");

const sunkShipSchema = Schema({
	shipType: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	length: {
		type: Number,
		required: true,
	},
});

const SunkShip = model("SunkShip", sunkShipSchema);

module.exports = SunkShip;
