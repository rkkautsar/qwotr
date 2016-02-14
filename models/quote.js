var mongoose = require('mongoose');
var voting   = require('mongoose-voting');

var QuoteSchema = new mongoose.Schema({
	text: {type: String, required: true},
	source: {type: String, require: false},
	author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
});

QuoteSchema.plugin(voting, {ref: 'User'});

module.exports = mongoose.model('Quote', QuoteSchema);