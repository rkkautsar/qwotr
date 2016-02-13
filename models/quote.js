var mongoose = require('mongoose');
var voting   = require('mongoose-voting');

var QuoteSchema = new mongoose.Schema({
	text: {type: String, required: true},
	author: {type: mongoose.Schema.Types.ObjectId, required: true},
});

QuoteSchema.plugin(voting, {ref: 'User'});

module.exports = mongoose.model('Quote', QuoteSchema);