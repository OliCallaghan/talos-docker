const Monitor = require("./monitor")

let testMonitor = new Monitor("https://fleetreach.co.uk", 5, function(err, site) {
	if (err) {
		console.log(site.url, "ERROR")
		throw err
	}
})

let testMonitor2 = new Monitor("https://finnian.io", 5, function(err, site) {
	if (err) {
		console.log(site.url, "ERROR")
		throw err
	}
})