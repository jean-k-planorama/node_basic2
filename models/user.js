
// Dependencies

var crypto = require('crypto');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var BBO = require('bluebirds').Object;

// Internal requires

var db = require('../modules/database');


/***********************************************************************************************************************
 * User
 ***********************************************************************************************************************
 *
 * Define a new User:
 * user = User.create({username: <username>, password: <password>}); // initiate object
 * user.save(callback); // saves object to DB and adds an _id to user

 * Get a User from an object retrieved directly from Database:
 * user = User.create({username: <username>, hashedPassword: <hashedPassword>, _id: <_id>});

 * Find a user by name:
 * User.findByName(username, callback);
 * Find a user by mongo id:
 * User.findById(id, callback);
 * Or by other fields
 * User.findOne({<filter object>}, callback);
 *
 **********************************************************************************************************************/
var User = BBO.extend({

    username: '',
    hashedPassword: '',

    /**
     * init
     *
     * @info initialization comportment setting for different formats of input parameters
     */
    init: function init(){
      if (!this.username) throw new Error('No username provided');

      // copy hash if directly provided else hash the password
      this.hashedPassword = this.hashedPassword || (this.password && this.hash(this.password));
      if (!this.hashedPassword) throw new Error('No password provided');

      // and throw away the password (important)
      delete this.password;

      // convert _id as a Mongo ID if provided
      if (this._id){
        this._id = ObjectID(this._id);
      }
    },

    /**
     * hash
     *
     * @info defines a username-dependant hash algorithm for password storing and checking
     *
     * @param password
     * @returns {*}
     */
    hash: function hash(password) {
      if (!password) throw new Error('Cannot hash empty password');
      return crypto.createHash('md5').update(password + 'ds3qh2zekq9jrez' + this.username).digest('hex');
    },

    /**
     * validPassword
     * @param password
     * @returns {boolean}
     */
    validPassword: function validPassword(password) {
      return this.hashedPassword === this.hash(password);
    },

    /**
     * resetPassword
     *
     * @info redefines the password only if the oldPassword matches
     * (! does not automatically save in the database)
     *
     * @param password
     * @param oldPassword
     * @returns {User}
     */
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

    /**
     * save
     *
     * @info saves into the users collection
     *
     * @param callback
     * @returns {*|Session}
     */
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

    /**
     * findOne
     *
     * @param filter
     * @param callback
     * @returns {*}
     */
    findOne: function findOne(filter, callback) {
      cls = this;
      return this.getCollection().findOne(filter, function(err, item){
        err = err || (!item && new Error('No user found'));
        if (err) return callback(err);
        return callback(err, cls.create(item));
      });
    },

    /**
     * findById
     *
     * @param id
     * @param callback
     * @returns {*}
     */
    findById: function findById(id, callback) {
      // Important: make the conversion into a valid Mongo ID before searching
      return this.findOne({_id: ObjectID(id)}, callback);
    },

    /**
     * count
     *
     * @param query
     * @param callback
     * @returns {*|null}
     */
    count: function count(query, callback) {
      return this.getCollection().count(query, callback);
    },

    /**
     * remove
     *
     * @param query
     * @param callback
     * @returns {*}
     */
    remove: function remove(query, callback) {
      return this.getCollection().remove(query, callback);
    },

    /**
     * initCollec
     *
     * @info re-initiates the Users collection (erase data and reset indexes)
     *
     * @param callback
     * @returns {*}
     */
    initCollec: function initCollec(callback) {
      function indexInit(collection, cb) {
        collection.ensureIndex({ "username": 1 }, { unique: true }, cb);
      }
      return this.db.initCollec(this.getCollection(), indexInit, callback);
    }

  }
);


module.exports = User;