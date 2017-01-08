var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('express-flash');


var exphbs  = require('express-handlebars');
var app = express();

mongoose.connect("localhost/talos");
mongoose.connection.on('error', function() {
	console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
	process.exit(1);
});

require('./config/passport');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: "just a random string", resave: true, saveUninitialized: true, store: new MongoStore({mongooseConnection: mongoose.connection}) }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});
app.use(express.static(__dirname + '/statics'));

// Controllers
var userController = require('./controllers/user');

app.get('/', function (req, res) {
	res.render('home', {
		title: 'Talos',
		user: req.user,
		css: "login"
	});
});

app.get('/dashboard', function (req, res) {
	if (req.user) { // user is logged in
		req.user.sites = [ // fake some sites for the time being
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
		];
		res.render('dashboard', {
			title: 'Talos - Dashboard',
			user: req.user,
			css: "dashboard"
		});
	} else {
		res.redirect("/login")
	}

});


// Passport routes
// app.get('/account', userController.ensureAuthenticated, userController.accountGet);
// app.put('/account', userController.ensureAuthenticated, userController.accountPut);
// app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
// app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);

app.listen(3000, function () {
	console.log('Talos listening on port 3000!')
});
