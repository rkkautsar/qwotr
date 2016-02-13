var mongoose      = require('mongoose');
var passportLocal = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true}
});

UserSchema.plugin(passportLocal, {
	usernameQueryFields: ['email']
});

module.exports = mongoose.model('User', UserSchema);