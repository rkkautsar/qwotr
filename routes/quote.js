var express = require('express');
var router  = express.Router();
var Quote   = require('../models/quote');
var User    = require('../models/user');

router.get('/', function(req, res){
	Quote.find({}).populate('author').exec(function(err, quotes) {
		res.render('quotes/index', {
			quotes: quotes,
			logged: req.user,
			title: 'Quotes'
		});
	});
});

router.get('/new', function(req, res){
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	res.render('quotes/edit', {
		message: "Create new quotes",
		logged: req.user,
		title: "Create new quotes"
	});
});

router.get('/:id/edit', function(req, res){
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	Quote.findById(req.params.id).populate('author').exec(function(err, quote){
		if(req.user.id != quote.author.id)
			return res.sendStatus(403);

		res.render('quotes/edit', {
			message: "Edit your quotes",
			quote: quote,
			logged: req.user,
			title: "Edit your quotes"
		});
	});

});


// create
router.post('/new', function(req, res){
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	var quote = new Quote({
		text: req.body.quote_text,
		source: req.body.source,
		author: req.user,
	});

	quote.save();

	res.redirect(req.baseUrl);
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
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	Quote.update({_id: req.params.id},{text: req.body.quote_text, source: req.body.source}, function(err) {
		if(err)
			console.log(err);
		else
			res.redirect(req.baseUrl);
	});
});

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
		if(quote.voted(req.user._id))
			quote.unvote(req.user._id);
		else
			quote.upvote(req.user._id);
		quote.save();
		res.redirect(req.baseUrl);
	});
});


router.get('/:id/downvote', function(req, res) {
	if(!req.user)
		return res.redirect('/login?ref=' + req.originalUrl);

	Quote.findById(req.params.id, function(err, quote) {
		if(quote.voted(req.user._id))
			quote.unvote(req.user._id);
		else
			quote.downvote(req.user._id);
		quote.save();
		res.redirect(req.baseUrl);
	});
});

module.exports = router;
