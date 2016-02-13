var express = require('express');
var router  = express.Router();
var Quote   = require('../models/quote');
var User    = require('../models/user');

router.get('/', function(req, res){
	Quote.find({}, function(err, quotes) {
		res.send(quotes);
	});
});

// create
router.post('/new', function(req, res){
	var quote = new Quote({
		text: req.body.quote_text,
		author: req.user
	});

	quote.save();

	res.redirect('/quote/')
});

// read
router.get('/:id', function(req, res) {
	Quote.findById(req.params.id,function(err, quote) {
		if(!quote)
			return res.sendStatus(404);
		User.findById(quote.author, function(err, author) {
			res.send(quote + "\n\n" + author + "\n\n" + quote.votes());
		});
	});
});

// update
router.put('/:id/edit', function(req, res) {
	Quote.update({_id: req.params.id},{text: req.body.quote_text}, function(err) {
		if(err)
			console.log(err);
		else
			res.redirect(req.baseUrl);
	});
})

// delete
router.delete('/:id/delete', function(req, res) {
	Quote.remove({_id: req.params.id}, function(err) {
		if(err)
			console.log(err);
		else
			res.redirect(req.baseUrl);
	});
});

router.get('/:id/upvote', function(req, res) {
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	Quote.findById(req.params.id, function(err, quote) {
		quote.upvote(req.user._id);
		quote.save();
		res.redirect(req.baseUrl);
	});
});


router.get('/:id/downvote', function(req, res) {
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	Quote.findById(req.params.id, function(err, quote) {
		quote.downvote(req.user._id);
		quote.save();
		res.redirect(req.baseUrl);
	});
});

module.exports = router;
