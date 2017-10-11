var assert = require("assert");

var Freet = require('../models/freet');
var User = require('../models/user');

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/fritterTest")


describe('Freet', function() {
  
  describe('#newFreet', function () {

    it('should create new freet', function (done) {
      Freet.remove({}, function(err) {
        User.remove({}, function(err) {
          User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
            Freet.newFreet(elysa, 'test message', function(err, freet) {
              assert.deepEqual(freet.author._id, elysa._id);
              assert.deepEqual(freet.message, 'test message');
              assert.deepEqual(freet.isRefreet, false);
              done();
            });
          });
        });
      });
    });

  });

  describe('#newRefreet', function () {

    it('should create new refreet', function (done) {
      Freet.remove({}, function(err) {
        User.remove({}, function(err) {
          User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
            User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
              Freet.newFreet(elysa, 'test message', function(err, freet) {
                Freet.newRefreet(sharon, freet._id, function(err, refreet) {
                  assert.deepEqual(refreet.author._id, sharon._id);
                  assert.deepEqual(refreet.message, 'test message');
                  assert.deepEqual(refreet.isRefreet, true);
                  console.log(refreet.originalFreetAuthor);
                  assert.deepEqual(refreet.originalFreetAuthor, elysa._id);
                  done();
                });
              });
            });
          });
        });
      });
    });

  });

  describe('#deleteFreet', function () {

    it('should delete existing freet', function (done) {
      Freet.remove({}, function(err) {
        User.remove({}, function(err) {
          User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
            Freet.newFreet(elysa, 'test message', function(err, freet) {
              Freet.find({}, function(err, freets) {
                assert.deepEqual(freets.length, 1);              
                Freet.deleteFreet(freet._id, function(err, freet) {
                  Freet.find({}, function(err, freets) {
                    assert.deepEqual(freets.length, 0); 
                    done();             
                  });
                });
              });
            });
          });
        });
      });
    });

  });

  describe('#getAllFreets', function () {

    it('get all freets when no freets in database', function (done) {
      Freet.remove({}, function(err) {
        Freet.getAllFreets(function(err, freets) {
          assert.deepEqual(freets.length, 0);
          done();
        });
      });
    });

    it('get all freets when at least 1 freet in database', function (done) {
      Freet.remove({}, function(err) {
        User.remove({}, function(err) {
          User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
            Freet.newFreet(elysa, 'test message', function(err, freet) {
              Freet.getAllFreets(function(err, freets) {
                assert.deepEqual(freets.length, 1);
                done();
              });
            });
          });
        });
      });
    });

  });

  describe('#getFreetsByAuthors', function () {

    it('no freets by authors', function (done) {
      Freet.remove({}, function(err) {
        User.remove({}, function(err) {
          User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
            Freet.getFreetsByAuthors([elysa], function(err, freets) {
              assert.deepEqual(freets.length, 0);
              done();
            });
          });
        });
      });
    });

    it('at least 1 freet by authors but also at least 1 freet not by authors', function (done) {
      Freet.remove({}, function(err) {
        User.remove({}, function(err) {
          User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
            User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
              Freet.newFreet(elysa, 'test message', function(err, elysaFreet) {
                Freet.newFreet(sharon, 'test message', function(err, sharonFreet) {
                  Freet.getFreetsByAuthors([elysa], function(err, freets) {
                    assert.deepEqual(freets.length, 1);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

  });

});

describe('User', function() {

  describe('#newUser', function () {

    it('should create new user', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, user) {
          assert.deepEqual(user.fullName, 'Elysa Kohrs');
          assert.deepEqual(user.username, 'elysakohrs');
          assert.deepEqual(user.password, 'password');
          assert.deepEqual(user.following.length, 0);
          done();
        });
      });
    });

  });

  describe('#addFollow', function () {

    it('add following to user following no users', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          assert.deepEqual(elysa.following.length, 0);
          User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
            User.addFollow(elysa._id, sharon._id, function(err, elysa) {
              assert.deepEqual(elysa.following.length, 1);
              done();
            });
          });
        });
      });
    });

    it('add following to user following at least 1 user', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          assert.deepEqual(elysa.following.length, 0);
          User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
            User.newUser('Maria Messick', 'mmessick', 'password', function(err, maria) {
              User.addFollow(elysa._id, sharon._id, function(err, elysa) {
                assert.deepEqual(elysa.following.length, 1);
                User.addFollow(elysa._id, maria._id, function(err, elysa) {
                  assert.deepEqual(elysa.following.length, 2);
                  done();
                });
              });
            });
          });
        });
      });
    });

  });

  describe('#getFollowingUsers', function () {

    it('get following users for user following no users', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.getFollowingUsers(elysa._id, function(err, followingUsers) {
            assert.deepEqual(followingUsers.length, 0);
            done();
          });
        });
      });
    });

    it('get following users for user following at least 1 user', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          assert.deepEqual(elysa.following.length, 0);
          User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
            User.addFollow(elysa._id, sharon._id, function(err, elysa) {
              User.getFollowingUsers(elysa._id, function(err, followingUsers) {
                assert.deepEqual(followingUsers.length, 1);
                done();
              });
            });
          });
        });
      });
    });

  });

  describe('#getNonFollowingUsers', function () {

    it('get non-following users when only 1 user in database', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.getNonFollowingUsers(elysa._id, function(err, nonFollowingUsers) {
            assert.deepEqual(nonFollowingUsers.length, 0);
            done();
          });
        });
      });
    });

    it('get non-following users for user not following any users in database', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
            User.getNonFollowingUsers(elysa._id, function(err, nonFollowingUsers) {
              assert.deepEqual(nonFollowingUsers.length, 1);
              done();
            });
          });
        });
      });
    });

    it('get non-following users for user following all users in database', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.newUser('Sharon Wu', 'sharonwu', 'password', function(err, sharon) {
            User.addFollow(elysa._id, sharon._id, function(err, elysa) {
              User.getNonFollowingUsers(elysa._id, function(err, nonFollowingUsers) {
                assert.deepEqual(nonFollowingUsers.length, 0);
                done();
              });
            });
          });
        });
      });
    });

  });

  describe('#isUsernameInUse', function () {

    it('username not in use', function (done) {
      User.remove({}, function(err) {
        User.isUsernameInUse('test', function(err, inUse) {
          assert.deepEqual(inUse, false);
          done();
        });
      });
    });

    it('username in use', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.isUsernameInUse('elysakohrs', function(err, inUse) {
            assert.deepEqual(inUse, true);
            done();
          });
        });
      });
    });

  });

  describe('#isCorrectPassword', function () {

    it('correct password', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.isCorrectPassword('elysakohrs', 'password', function(err, isCorrectPassword) {
            assert.deepEqual(isCorrectPassword, true);
            done();
          });
        });
      });
    });

    it('incorrect password', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.isCorrectPassword('elysakohrs', 'notpassword', function(err, isCorrectPassword) {
            assert.deepEqual(isCorrectPassword, false);
            done();
          });
        });
      });
    });

  });

  describe('#getUserByUsername', function () {

    it('get user by username', function (done) {
      User.remove({}, function(err) {
        User.newUser('Elysa Kohrs', 'elysakohrs', 'password', function(err, elysa) {
          User.getUserByUsername('elysakohrs', function(err, user) {
            assert.deepEqual(elysa._id, user._id);
            assert.deepEqual(elysa.fullName, user.fullName);
            assert.deepEqual(elysa.username, user.username);
            assert.deepEqual(elysa.password, user.password);
            done();
          });
        });
      });
    });

  });
  
});