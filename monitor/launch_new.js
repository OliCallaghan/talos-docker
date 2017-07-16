const Monitor = require("./monitor")
var ipc = require('node-ipc')

var monitors = [];

ipc.config.silent = true;

ipc.connectToNet('monitor', 'talos-ui', 8000, function () {
	ipc.of.monitor.on('connect', function () {
		console.log('connected to master')
	})

	ipc.of.monitor.on('launch monitor', function (data) {
		console.log(data)
		monitors.push(new Monitor(data.user, data.url, data.refreshRate * 60, function (err, site) {
			console.log(err);
		}));
		console.log('recieved event');
		console.log(data);
	})
})

/*server.on('create monitor', function (message, params) {
	console.log('message: ' + message);
	console.log('params: ' + params);
	monitors[id] = new Monitor(params.user, params.url, params.interval);
});

server.on('remove monitor', function (id) {
	monitors[id].remove();
	delete monitors[id];
});
*/
