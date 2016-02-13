var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var morgan         = require('morgan');
var nunjucks       = require('express-nunjucks');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var path           = require('path');

var app         = express();
var config      = require('./config');
var indexRoutes = require('./routes/index');
var userRoutes  = require('./routes/user');
var quoteRoutes = require('./routes/quote');
var User        = require('./models/user');

var port = process.env.PORT || config.port;
var db   = process.env.MONGOLAB_URI || config.db;

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
nunjucks.setup({
	autoescape: false,
	watch: true
}, app);

// Common Middleware
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(require('method-override')(function(req,res){
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// Database
mongoose.connect(db);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Development
if (config.dev) {
	app.use(morgan('dev'));
}

// Routes
app.use('/', indexRoutes);
app.use('/user/', userRoutes);
app.use('/quotes/', quoteRoutes);

// Start
app.listen(port);
console.log('App running on port ' + port);