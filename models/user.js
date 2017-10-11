var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	fullName: String,
	username: {type: String, unique: true},
	password: String,
	following: [{type: ObjectId, ref: 'User'}]
});

/**
 * Create a new user.
 * 
 * @param {String} fullName The full name of the new user.
 * @param {String} username The username of the new user.
 * @param {String} password The password of the new user.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, newUser), where newUser is a User.
 */ 
userSchema.statics.newUser = function(fullName, username, password, cb) {
	this.create({
    	fullName: fullName,
    	username: username,
    	password: password
	}, cb);
}

/**
 * Record a new follow.
 * 
 * @param {ObjectId} followerId The ObjectId of the user who wants to follow
 *		another user.
 * @param {ObjectId} followingId The ObjectId of the user to be followed.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, follower), where follower is a User.
 */ 
userSchema.statics.addFollow = function(followerId, followingId, cb) {
	// Find the following user
	this.findById(followingId, function(err, following) {
        if (err) {
            cb(err, null);
        } else {
            // Find the follower user
            User.findById(followerId, function(err, follower) {
            	if (err) {
            		cb(err, null);
            	} else {
	                // Add the following user to the follower user's list of following users
	                follower.following.push(following);
	                follower.save(cb);
				}
            });
        }
    });
}

/**
 * Get the users a specified user is following.
 * 
 * @param {ObjectId} userId The ObjectId of the user.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, usersFollowing), where usersFollowing is
 *		a list of User documents.
 */ 
userSchema.statics.getFollowingUsers = function(userId, cb) {
    this.findById(userId).populate('following').exec(function(err, user) {
        if (err) {
            cb(err, null);
        } else {
            var usersFollowing = user.following;
            cb(err, usersFollowing);
        }
    });
}

/**
 * Get the users a specified user is not following (and excluding self).
 * 
 * @param {ObjectId} userId The ObjectId of the user.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, usersNotFollowing), where usersFollowing is
 *		a list of User documents.
 */ 
userSchema.statics.getNonFollowingUsers = function(userId, cb) {
    this.getFollowingUsers(userId, function(err, followingUsers) {
    	if (err) {
    		cb(err, null);
    	} else {
            User.find({ _id: { $nin: followingUsers, $ne: userId }}, cb);
    	}
    });
}

/**
 * Get whether a username is already in use.
 * 
 * @param {String} username The potential username.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, isInUse), where isInUse is a boolean that
 * 		is true if the username is already in use, otherwise false.
 */ 
userSchema.statics.isUsernameInUse = function(username, cb) {
    this.find({ username: username }, function(err, users) {
        if (err) {
            cb(err, null);               
        } else if (users.length > 0) {
            cb(err, true);
        } else {
        	cb(err, false);
        }
    });
}

/**
 * Given a username and password, get whether the password is correct
 * for the user with the specified username.
 * 
 * @param {String} username The username of the user.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, isCorrectPassword), where isCorrectPassword is a 
 *		boolean that is true if the password is correct, otherwise false.
 */ 
userSchema.statics.isCorrectPassword = function(username, password, cb) {
	this.findOne({username: username}, function(err, user) {
		if (err || user === null) {
			cb(err, null);
		} else {
			var isCorrectPassword = user.password === password;
			cb(err, isCorrectPassword);
		}
	})
}

/**
 * Given a username, get the User with that username.
 * 
 * @param {String} username The username of the user.
 * @param {Function} cb The callback function to execute, of the
 *		format cb(err, user), where user is a User document or null
 *		if there does not exist a user with the specified username.
 */ 
userSchema.statics.getUserByUsername = function(username, cb) {
	this.findOne({username: username}, cb);
}

var User = mongoose.model('User', userSchema);

module.exports = User;

