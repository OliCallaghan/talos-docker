const os = require('os')
var ipc = require('node-ipc')

var slaves = []
var slave_i = 0

ipc.config.silent = true;

ipc.serveNet(os.hostname(), 8000, function () {
	ipc.server.on('connect', function (socket) {
		slaves.push(socket)
	})
});

module.exports = {
	launchNewMonitor: function (params, callback) {
		cleanSlaves()
		if (slaves.length != 0) {
			if (slave_i >= slaves.length) {
				slave_i = 0
			}
			console.log(params);
			ipc.server.emit(slaves[slave_i], 'launch monitor', {
				refreshRate: params.refreshRate,
				user: params.user,
				url: params.url
			});
			slave_i++
		} else {
			console.log('Not enough slaves');
		}
	},

	destroyMonitor: function () {

	},

	reconfigureMonitor: function () {

	}
};

function cleanSlaves() {
	let i = 0
	while (i < slaves.length) {
		if (slaves[i].readable == false) {
			delete slaves[i]
		} else {
			i++
		}
	}
}

ipc.server.start();
