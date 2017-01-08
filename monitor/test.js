const Monitor = require("./monitor")

let testMonitor = new Monitor("ObjectId instance in here", "https://fleetreach.co.uk/", 5, function(err, site) {
	if (err) {
		console.log(site.url, "ERROR")
		throw err
	}
})

let testMonitor2 = new Monitor("ObjectId instance in here", "https://alexa.finnian.io/feed", 5, function(err, site) {
	if (err) {
		console.log(site.url, "ERROR")
		throw err
	}
})