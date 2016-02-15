var express  = require('express');
var router   = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.get('/', function(req, res){
	res.render('index', {
		title : 'Homepage',
		body : 'Hello',
		logged : req.user
	});
});

// Login and Register

router.get('/register', function(req, res){
	res.render('register', { logged: req.user });
});

router.post('/register', function(req, res){
	var pass = req.body.password,
		confirm = req.body.confirm;
	if(pass != confirm)
		return res.render('register', {info: 'The passwords does not match.'});

	User.register(new User({ 
		email : req.body.email,
		username: req.body.username
	}), req.body.password, function(err, user){
		if(err) 
			return res.render('register', {info: 'Sorry. That username already exists. Try again.'});
		
		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});

router.get('/login', function(req, res){
	res.render('login', { logged: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res){
	if(req.query.ref)
		res.redirect(req.query.ref);
	else res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;