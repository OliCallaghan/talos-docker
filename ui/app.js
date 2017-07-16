var fs = require('fs');
var express = require('express');
var http = require("http");
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('express-flash');
const url = require('url')

var ObjectId = mongoose.Types.ObjectId;

var exphbs  = require('express-handlebars');
var app = express();

if (process.env.MONGO_PORT_27017_TCP_ADDR && process.env.MONGO_PORT_27017_TCP_PORT) {
	mongoose.connect('mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+':'+process.env.MONGO_PORT_27017_TCP_PORT+'/talos')
} else {
	mongoose.connect('localhost/talos')
}

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
		Site.find({ user: ObjectId(req.user._id) }, function(err, sites){
			if (err) throw err
			res.render('dashboard', {
				title: 'Talos - Dashboard',
				user: req.user,
				sites: sites,
				css: "dashboard"
			});
		})
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

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000, function (){
	console.log('Talos listening on port 3000!')
});

io.engine.ws = new (require('uws').Server)({
	noServer: true,
	perMessageDeflate: false
});

const Site = require("./models/Site")
const comms = require("./modules/comms.js")
const site = require("./controllers/site")

function displayName(URL) {
	if (URL.indexOf("http://") === -1 && URL.indexOf("https://") === -1) {
		URL = "http://" + URL
	}
	URL = url.parse(URL) // semantic, huh?
	let displayName = URL.host
	if (URL.pathname && URL.pathname != "/") displayName += URL.pathname
	return displayName
}

io.on("connection", function(socket) {
	socket.on("refresh sites", function(user, callback) {
		Site.find({ user: ObjectId(user) }, function(err, sites) {
			if (err) throw err
			callback(sites)
			console.log(sites);
		})
	})

	socket.on("create site", function(params, callback) {
		if (params.protocol != "http" && params.protocol != "https") {
			console.log('Invalid Protocol');
		} else {
			params.url = params.protocol + "://" + params.url;

			params.info = {
				latency: 0,
				updatedAt: Date.now(),
				statusCode: 0,
				statusMessage: "",
				status: ""
			}
			params.displayName = displayName(params.url)
			params.container = 1 // need to stop being hardcoded
			params.user = ObjectId(params.user)
			params.refreshRate = params.refreshRate / 60
			if (params.url && params.user && params.refreshRate) {
				console.log(params);
				site.create(params, function(err, site) {
					if (err) throw err
					if (site.duplicate) {
						callback(false, "Duplicate monitor detected")
					} else {
						// Add to User Container
						console.log('about to launch monitor');
						comms.launchNewMonitor(params, function (err) {
							if (!err) {
								callback(true, site);
							} else {
								console.log('Not enough slaves, need to scale');
							}
						});
					}
				})
			} else {
				callback(false, "Invalid parameters passed")
			}
		}
	})
});
