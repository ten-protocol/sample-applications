const { Schema, model } = require("mongoose");

const messageSchema = Schema({
	message: {
		type: String,
		required: true,
	},
});

const Message = model("Message", messageSchema);

module.exports = Message;
