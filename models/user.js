
// Dependencies

var crypto = require('crypto');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var BBO = require('bluebirds').Object;

// Internal requires

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

var User = BBO.extend({
    username: '',
    hashedPassword: '',

    init: function init(){
      if (!this.username) throw new Error('No username provided');
      this.hashedPassword = this.hashedPassword || (this.password && this.hash(this.password));
      if (!this.hashedPassword) throw new Error('No password provided');
      if (this._id){
        this._id = ObjectID(this._id);
      }
    },

    hash: function hash(password) {
      if (!password) throw new Error('Cannot hash empty password');
      return crypto.createHash('md5').update(password + 'ds3qh2zekq9jrez' + this.username).digest('hex');
    },

    validPassword: function validPassword(password) {
      return this.hashedPassword === this.hash(password);
    },

    resetPassword: function resetPassword(password, oldPassword) {
      if(!this.validPassword(oldPassword)){
        throw new Error('Invalid password');
      }
      if(!password){
        throw new Error('Empty password');
      }
      this.hashedPassword = this.hash(password);
      return this;
    },

    save: function save(callback) {
      return this.constructor.getCollection().save(this, callback);
    }
  },
  // static attributes:
  {
    db: db,

    getCollection: function getCollection() {
      return this.db.collection('users');
    },

    findOne: function findOne(filter, callback) {
      cls = this;
      return this.getCollection().findOne(filter, function(err, item){
        err = err || (!item && new Error('No user found'));
        if (err) return callback(err);
        return callback(err, cls.create(item));
      });
    },
  
    findById: function findById(id, callback) {
      return this.findOne({_id: ObjectID(id)}, callback);
    },
    
    findByName: function findUser(username, callback) {
      return this.findOne({ username: username }, callback);
    },
    
    count: function count(query, callback) {
      return this.getCollection().count(query, callback);
    },
    
    remove: function remove(query, callback) {
      return this.getCollection().remove(query, callback);
    },
    
    initCollec: function initCollec(callback) {
      function index_init(collection, cb) {
        collection.ensureIndex({ "username": 1 }, { unique: true }, cb);
      }
      return this.db.initCollec(this.getCollection(), index_init, callback);
    }

  }
);


module.exports = User;