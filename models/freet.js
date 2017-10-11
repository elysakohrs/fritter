var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var freetSchema = mongoose.Schema({
	author: {type: ObjectId, ref: 'User'},
	message: String,
	timestamp: {type: Date, default: Date.now },
	isRefreet: {type: Boolean, default: false},
	originalFreetAuthor: {type: ObjectId, ref: 'User', default: null}
});

/**
 * Create a new original freet.
 * 
 * @param {User} author The author of the freet.
 * @param {String} message The text of the freet.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, newFreet).
 */ 
freetSchema.statics.newFreet = function(author, message, cb) {
	this.create({
    	author: author,
    	message: message
	}, cb);
}

/**
 * Create a new refreet.
 * 
 * @param {User} author The author of the freet.
 * @param {ObjectId} originalFreetId The ObjectId of the freet that 
 *		this is a refreet of.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, newRefreet).
 */ 
freetSchema.statics.newRefreet = function(author, originalFreetId, cb) {
    this.findOne({ _id: originalFreetId }, function(err, originalFreet) {
    	if (err) {
    		cb(err, null);
    	} else {
			Freet.create({
		    	author: author,
		    	message: originalFreet.message,
		    	isRefreet: true,
		    	originalFreetAuthor: originalFreet.author
			}, cb);
		}
	});
}

/**
 * Delete a freet.
 * 
 * @param {ObjectId} freetId The id of the freet to delete.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, freet), where freet is the deleted Freet
 *		document.
 */ 
freetSchema.statics.deleteFreet = function(freetId, cb) {
    this.findOne({ _id: freetId }).remove(cb);
}

/**
 * Get all freets.
 * 
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, freets).
 */ 
freetSchema.statics.getAllFreets = function(cb) {
	Freet.find().populate('author originalFreetAuthor').exec(cb);
}

/**
 * Get all freets by certain authors.
 * 
 * @param {ObjectId} authors The list of User documents that
 *		the found freets should be authored by.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, freets), where freets is all freets
 *		by an author in authors.
 */ 
freetSchema.statics.getFreetsByAuthors = function(authors, cb) {
	Freet.find({ 
        author: { $in: authors }
    }).populate('author originalFreetAuthor').exec(cb);
}

var Freet = mongoose.model('Freet', freetSchema);

module.exports = Freet;