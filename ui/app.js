var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static('statics'));

app.get('/', function (req, res) {
	fs.readFile('pages/index.html', 'utf-8', function (err, data) {
		res.send(data);
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
