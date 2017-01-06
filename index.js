const Monitor = require('ping-monitor');


const finnianMonitor = new Monitor({
	website: 'https://alexa.finnian.io/',
	interval: 1/60 // every second
})

finnianMonitor.on('up', function (res) {
	console.log(res.website, 'is up.')
})


finnianMonitor.on('down', function (res) {
	console.log(res.website, 'is down!', res.statusCode, res.statusMessage)
})


finnianMonitor.on('error', function (res) {
	console.log(res.website, res)
	finnianMonitor.stop()
})


finnianMonitor.on('stop', function (website) {
	console.log(website, 'monitor has stopped.')
})
