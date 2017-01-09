const mongoose = require('mongoose')
const config = require("../config")

if (config.docker) {
	mongoose.connect('mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+':'+process.env.MONGO_PORT_27017_TCP_PORT+'/talos')
} else {
	mongoose.connect('localhost/talos')
}

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const siteSchema = new Schema({
	user: ObjectId,
	container: Number,
	refreshRate: Number,
	url: String,
	displayName: String,
	info: {
		latency: Number,
		updatedAt: Date,
		statusCode: Number,
		statusMessage: String,
		status: String
	}
})

module.exports = mongoose.model('Site', siteSchema)