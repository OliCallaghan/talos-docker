const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/talos')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const siteSchema = new Schema({
	user: ObjectId,
	container: Number,
	refreshRate: Number,
	url: String,
	info: {
		latency: Number,
		updatedAt: Date,
		statusCode: Number,
		statusMessage: String,
		status: String
	}
})

module.exports = mongoose.model('Site', siteSchema)