const Monitor = require('ping-monitor')
const mongoose = require('mongoose')
const Site = require("./controllers/site")
const url = require('url')

function Me(user, website, interval, callback) {
	let self = this
	self.interval = interval

	Site.create({
		user: mongoose.Schema.ObjectId(user),
		container: 1,
		refreshRate: interval / 60,
		url: website,
		displayName: this.displayName(website),
		info: {
			latency: 0,
			updatedAt: Date.now(),
			statusCode: 0,
			statusMessage: "",
			status: ""
		}
	}, function(err, site) {
		self.lastUpdated = Date.now()
		if (!err) self.site = site._id
		callback(err, site)
	})
	this.monitor = new Monitor({
		website: website,
		interval: interval / 60
	})

	this.monitor.on('up', function (res) {
		self.updateSiteInfo(res, "up")
	})

	this.monitor.on('down', function (res) {
		self.updateSiteInfo(res, "down")
	})

	this.monitor.on('error', function (res) {
		self.updateSiteInfo(res, "down")
	})
}

Me.prototype.displayName = function(URL) {
	URL = url.parse(URL) // semantic, huh?
	let displayName = URL.host
	if (URL.pathname != "/") displayName += URL.pathname
	return displayName
}

Me.prototype.updateSiteInfo = function(res, status) {
	let self = this
	Site.update(this.site, {
		info: {
			latency: res.latency,
			updatedAt: Date.now(),
			statusCode: res.statusCode,
			statusMessage: res.statusMessage,
			status: status
		}
	}, function(err, site) {
		if (err) throw err
		if (!site) {
			self.monitor.stop()
			console.log(res.website, "was removed")
		} else {
			self.lastUpdated = res.time
			console.log(res.website, "is", status, res.statusCode, res.statusMessage, res.latency + "ms")
		}
	})
}

module.exports = Me