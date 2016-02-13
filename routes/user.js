var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var Quote   = require('../models/quote');

router.get('/', function(req, res){
	User.find({}, function(err, users) {
		res.render('users', {
			users: users,
			logged: req.user
		})
	});
});

router.get('/:uname', function(req,res) {
	User.findOne({username: req.params.uname},function(err, user) {
		if(!user)
			return res.sendStatus(404);
		Quote.find({author: user._id}, function(err, quotes) {
			res.send(quotes);
		});
	});
});

module.exports = router;
