var mongoose = require('mongoose');
var quoteSchema = new mongoose.Schema({
	season: Number,
	episode: Number,
	scene: Number,
	line: Number,
	character: String,
	quote: String
});
module.exports = mongoose.model('Quotes', quoteSchema);