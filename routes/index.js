var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Freet = require('../models/freet');
var User = require('../models/user');

/**
 * Test whether a session is in progress.
 * 
 * @param {Object} req The requst object, such that req.session.user is the session
 *      user if there is a session in proress.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with properties 'success' (a boolean), 'loggedIn' (a boolean 
 *      representing whether a session is in progress), and 'user' (a User object 
 *      representing the session user) if 'loggedIn' is true.
 */ 
var testIfSession = function(req, res) {
    if (req.session.user) {
        res.json({
            'success': true,
            'loggedIn': true,
            'user': req.session.user
        });
    } else {
        res.json({
            'success': true,
            'loggedIn': false
        });
    }
}

/**
 * Post a new freet to Fritter.
 * 
 * @param {Object} req The requst object, such that req.body.isRefreet is a boolean
 *      corresponding to whether the new freet is a refreet.
 * @param {Object} res The response object that will be sent with res.json containing
 * 		an object with properties 'success' (a boolean) and 'freet' (a Freet object that
 *      represents the new freet) and 'user' (a User object representing the session
 *      user) if 'success' is true.
 */	
var postFreet = function(req, res) {
    if (req.body.isRefreet === 'true') {
        postRefreet(req, res);
    } else {        
        postOriginalFreet(req, res);
    }
}

/**
 * Post an original freet (not a refreet) to Fritter.
 * 
 * @param {Object} req The requst object, such that req.session.user is the user
 *      posting the freet and req.body.message is the text of the freet.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with properties 'success' (a boolean) and 'freet' (a Freet object that
 *      represents the new freet) and 'user' (a User object representing the session
 *      user) if 'success' is true.
 */ 
var postOriginalFreet = function(req, res) {
    var author = req.session.user;
    // Create the new freet
    Freet.newFreet(author, req.body.message, function(err, newFreet) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {
            // Populate the author field of the new freet
            newFreet.populate('author', function(err, newFreet) {
                if (err) {
                    console.log(err);
                    res.json({ 'success': false });
                } else {                       
                    res.json({ 
                        'success': true,
                        'freet': newFreet,
                        'user': author
                    });
                }                 
            });
        }
    });
}

/**
 * Post a refreet to Fritter.
 * 
 * @param {Object} req The requst object, such that req.session.user is the user
 *      posting the refreet and req.body.freetId is the id of the original freet.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with properties 'success' (a boolean) and 'freet' (a Freet object that
 *      represents the new freet) and 'user' (a User object representing the session
 *      user) if 'success' is true.
 */ 
var postRefreet = function(req, res) {    
    var author = req.session.user;
    var originalFreetId = req.body.freetId;
    // Create the refreet
    Freet.newRefreet(author, originalFreetId, function(err, newFreet) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {
            // Populate the author and originalFreetAuthor fields of the refreet
            newFreet.populate('author originalFreetAuthor', function(err, newFreet) {
                if (err) {
                    console.log(err);
                    res.json({ 'success': false });
                } else {
                    newFreet.populate()      
                    res.json({ 
                        'success': true,
                        'freet': newFreet,
                        'user': author
                    });
                }                 
            });
        }
    });
}

/**
 * Get all the freets in Fritter.
 * 
 * @param {Object} req The requst object, such that req.session.user is the session 
 *      user.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with properties 'success' (a boolean) and 'freets' (a collection of
 *      Freet objects by users the session user is following the new freet) and 'user' 
 *      (a User object representing the session user) if 'success' is true.
 */
var getAllFreets = function(req, res) {
    Freet.getAllFreets(function(err, freets) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {
            // Sort freets by timestamp with newest first
            freets.sort(function(freet1, freet2){
                return freet2.timestamp - freet1.timestamp;
            });
            res.json({
                'success': true,
                'freets': freets,
                'user': req.session.user
            });
        }
    });
}

/**
 * Get all freets by users that the session user is following.
 * 
 * @param {Object} req The requst object, such that req.session.user is the session 
 *      user.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with properties 'success' (a boolean) and 'freets' (a collection of
 *      Freet objects by users the session user is following the new freet) and 'user' 
 *      (a User object representing the session user) if 'success' is true.
 */
var getFreetsOfFollowing = function(req, res) {
    var user = req.session.user;
    // Get users the session user is following
    User.getFollowingUsers(user._id, function(err, usersFollowing) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });            
        } else {
            // Get freets by the users the session user is following
            Freet.getFreetsByAuthors(usersFollowing, function(err, freets) {
                if (err) {
                    console.log(err);
                    res.json({ 'success': false });
                } else {
                    // Sort the freets by timestamp with most recent first
                    freets.sort(function(freet1, freet2){
                        return freet2.timestamp - freet1.timestamp;
                    });
                    res.json({
                        'success': true,
                        'freets': freets,
                        'user': user
                    });
                }
            });
        }
    });
}

/**
 * Record a new "follow" in Fritter, where one user is now following another.
 * 
 * @param {Object} req The requst object, such that req.session.user is the session 
 *      user and req.body.followingId is the id of the user they want to follow.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with property 'success' (a boolean).
 */
var createFollow = function(req, res) {
    User.addFollow(req.session.user._id, req.body.followingId, function(err, follower) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {
            res.json({ 
                'success': true
            });                
        }
    });
}

/**
 * Delete a freet if the session user is the author of the freet.
 * 
 * @param {Object} req The requst object, such that req.session.user is the session 
 *      user and req.params.freetId is the id of the freet to delete.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with property 'success' (a boolean).
 */
var deleteFreet = function(req, res) {
    Freet.deleteFreet(req.params.freetId, function(err, freet) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {
            res.json({
                'success': true
            });
        }
    });
}

/**
 * Attempt to create a User.
 * 
 * @param {Object} req The requst object, such that req.body.fullName is the user's
 *      full name, req.body.username is the user's desired username, and 
 *      req.body.password is the user's desired password.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with property 'success' (a boolean), property 'message' if an error
 *      occurred that should be stated to the user, and property 'user' if 'success'
 *      is true.
 */
var createUser = function(req, res) {
    var fullName = req.body.fullName;
    var username = req.body.username;
    var password = req.body.password;    
    // Make sure req contains non-empty full name, username, and password
    if (fullName.length === 0 || username.length === 0 || password.length === 0) {
        res.json({
            'success': false, 
            'message': "Full name, username, and password cannot be empty"
        });
    } else {
        // Determine if username is already taken
        User.isUsernameInUse(username, function(err, inUse) {
            if (err) {
                console.log(err);
                res.json({ 'success': false });                
            } else if (inUse) {
                res.json({
                    'success': false, 
                    'message': "Username taken"
                });
            } else {
                // Create new user with specified full name, username, and password
                User.newUser(fullName, username, password, function(err, newUser) {
                    if (err) {
                        console.log(err);
                        res.json({ 'success': false });
                    } else {
                        // Create session for new user                        
                        req.session.user = newUser;
                        res.json({
                            'success': true, 
                            'user': req.session.user
                        }); 
                    }
                });    
            }
        });
    }
}

/**
 * Attempt to log in with entered username and password.
 * 
 * @param {Object} req The requst object, such that req.body.username is the entered
 *      username and req.body.password is the entered password.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with property 'success' (a boolean), property 'message' if an error
 *      occurred that should be stated to the user, and property 'user' if 'success'
 *      is true.
 */
var attemptLogin = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username.length === 0 || password.length === 0) {
        res.json({
            'success': false,
            'message': 'Username and password cannot be empty'
        });
    } else {
        User.isUsernameInUse(username, function(err, inUse) {
             if (err) {
                console.log(err);
                res.json({ 'success': false });
            } else if (!inUse) {
                res.json({
                    'success': false,
                    'message': 'Username does not exist'
                });
            } else {  
                User.isCorrectPassword(username, password, function(err, isCorrectPassword) {
                    if (err) {
                        console.log(err);
                        res.json({ 'success': false });
                    } else if (!isCorrectPassword) {
                        res.json({
                            'success': false,
                            'message': 'Incorrect password'
                        });
                    } else {
                        User.getUserByUsername(username, function(err, user) {
                            if (err) {
                                console.log(err);
                                res.json({ 'success': false });
                            } else {
                                req.session.user = user;
                                res.json({
                                    'success': true,
                                    'user': req.session.user
                                });   
                            }                         
                        });
                    }
                });
            }         
        });
    }
}

/**
 * Attempt to log out (destroy current session).
 * 
 * @param {Object} req The requst object, such that req.session is the current
 *      session of the requesting user.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with property 'success' (a boolean).
 */
var attemptLogout = function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {
            res.json({
                'success': true
            });
        }
    });
}

/**
 * Get lists of users that the session user follows and does not follow.
 * 
 * @param {Object} req The requst object, such that req.session.user is the session 
 *      user.
 * @param {Object} res The response object that will be sent with res.json containing
 *      an object with property 'success' (a boolean) and following (a list of User
 *      objects) and nonFollowing (a list of User objects) if 'success' is true.
 */
var getFollowingAndNonfollowing = function(req, res) {
    var user = req.session.user;
    User.getFollowingUsers(user._id, function(err, followingUsers) {
        if (err) {
            console.log(err);
            res.json({ 'success': false });
        } else {  
            User.getNonFollowingUsers(user._id, function(err, nonFollowingUsers) {
                if (err) {
                    console.log(err);
                    res.json({ 'success': false });
                } else {
                    res.json({
                        'success': true,
                        'following': followingUsers,
                        'nonFollowing': nonFollowingUsers
                    });
                }
            });
        }
    });
}

// Test whether a session is in progress
router.get('/testIfSession', testIfSession);

// Register a new user
router.post("/signup", createUser);

// Login an already registered user
router.post("/login", attemptLogin);

// Logout a user
router.post("/logout", attemptLogout);

// Post a new freet (original freet or refreet)
router.post("/freets", postFreet);

// Get all freets
router.get("/freets", getAllFreets);

// Get all freets by users that a given user is following
router.get("/freets/following", getFreetsOfFollowing);

// Delete a freet with a specified id
router.delete("/freet/:freetId", deleteFreet);

// Post a new follow of one user following another
router.post("/follow", createFollow)

// Get lists of users a user is following and not following
router.get("/following", getFollowingAndNonfollowing)

module.exports = router;
