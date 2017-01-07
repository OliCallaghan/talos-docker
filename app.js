var fs = require('fs');
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

var hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: {
		ifeq: function(a, b, options) {
			if (a === b) {
				return options.fn(this);
			}
			return options.inverse(this);
		},
		toJSON : function(object) {
			return JSON.stringify(object);
		}
	}
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/statics'));

app.get('/', function (req, res) {
	res.render('home', {
		title: 'Talos'
	});
});

app.get('/dashboard', function (req, res) {
	res.render('dashboard', {
		title: 'Talos - Dashboard',
		user: {
			name: "Finnian"
		},
		sites: [
			{
				id: 1,
				name: "finnian.io"
			}, {
				id: 2,
				name: "fxapi.co.uk"
			}, {
				id: 3,
				name: "olicallaghan.com"
			},
		]
	});
});

app.listen(3000, function () {
	console.log('Talos listening on port 3000!')
});
