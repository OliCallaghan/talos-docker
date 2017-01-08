const mongoose = require('mongoose')

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