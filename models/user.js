
// dependencies

var crypto = require('crypto');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;

// other

var db = require('../modules/database');

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

  user_class = function User(obj) {
    var that;

    if(!(obj && obj.username)){
      throw new Error('Should have a username');
    }

    if(!(obj.hashedPassword || obj.password)) {
      throw new Error('Empty password');
    }

    var hash = function hash(password) {
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

    that.validPassword = function validPassword(password) {
      return that.hashedPassword === hash(password);
    };

    that.resetPassword = function resetPassword(password, oldPassword) {
      if(!that.validPassword(oldPassword)){
        throw new Error('Invalid password');
      }
      if(!password){
        throw new Error('Empty password');
      }
      that.hashedPassword = hash(password);
      return that;
    };

    that.save = function save(callback) {
      return user_class.getCollection().save(that, callback);
    };

    return that
  };

  user_class.getCollection = function getCollection(){
    return db.collection('users');
  };

  user_class.findOne = function findOne(filter, callback) {
    return user_class.getCollection().findOne(filter, function(err, item){
      err = err || (!item && new Error('No user found'));
      if (err) return callback(err);
      return callback(err, user_class(item));
    });
  };

  user_class.findById = function findById(id, callback) {
    return user_class.findOne({_id: ObjectID(id)}, callback);
  };

  user_class.findUser = function findUser(username, callback) {
    return user_class.findOne({ username: username }, callback);
  };

  user_class.count = function count(query, callback) {
    return user_class.getCollection().count(query, callback);
  };

  user_class.remove = function remove(query, callback) {
    return user_class.getCollection().remove(query, callback);
  };

  user_class.initCollec = function initCollec(callback) {
    function index_init(collection, cb) {
      collection.ensureIndex({ "username": 1 }, { unique: true }, cb);
    }
    return db.initCollec(user_class.getCollection(), index_init, callback);
  };

  return user_class;

}();


module.exports = User;