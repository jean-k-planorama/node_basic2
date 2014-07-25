
var crypto = require('crypto');
var _ = require('lodash');
var MongoHandler = require('planorama/mongohandler')
var ObjectID = require('mongodb').ObjectID



/*
Define a new User:
  user = User({username: <username>, password: <password>}); // initiate object
  user.save(callback); // saves object to DB and adds an _id to user

Get a User from an object retrieved directly from Database:
  user = User({username: <username>, hashedPassword: <hashedPassword>, _id: <_id>});

Find a user by name:
 User.findUser(username, callback);
Find a user by mongo id:
 User.findById(id, callback);
Or by other fields
 User.findOne({<filter object>}, callback);
 */

var User = function(){

  var handler = MongoHandler('users');

  user_class = function (obj) {
    var that;

    if(!(obj && obj.username)){
      throw new Error('Should have a username');
    }

    if(!(obj.hashedPassword || obj.password)){
      throw new Error('Empty password');
    }

    var hash = function(password){
      if (!password){
        throw new Error('Empty password');
      }
      return crypto.createHash('md5').update(password + 'ds3qh2zekq9jrez' + obj.username).digest('hex');
    };

    that = {
      username: obj.username,
      hashedPassword: obj.hashedPassword || hash(obj.password)
    };

    if(obj._id){
      that._id = ObjectID(obj._id);
    }

    that.validPassword = function (password) {
      return that.hashedPassword === hash(password)
    };

    that.resetPassword = function(password, oldPassword) {
      if (!(that.validPassword(oldPassword) && password)){
        return false
      }
      that.hashedPassword = hash(password)
      return true
    };

  that.save = function(callback) {
    return handler.save(that, callback);
  };

  return that
};

  user_class.findOne = function(filter, callback){
    return handler.findOne(filter, function(err, item){
      err = err || (!item && new Error('No user found'));
      if (err) {
        return callback(err, null);
      }
      return callback(err, user_class(item));
    });
  };

  user_class.findById = function(id, callback){
    return user_class.findOne({_id: ObjectID(id)}, callback);
  };

  user_class.findUser = function(username, callback){
    return user_class.findOne({ username: username }, callback);
  };

  user_class.count = function(query, callback){
    return handler.count(query, callback);
  };

  user_class.remove = function(query, callback){
    return handler.remove(query, callback);
  };

  user_class.initCollec = function(callback){
    function index_init(collection, callback2){
      collection.ensureIndex({ "username": 1 }, { unique: true }, callback2);
    }
    return handler.initCollec(index_init, callback);
  };

  return user_class;

}();


module.exports = User;