
// Dependencies

var crypto = require('crypto');

// Internal requires

var BaseModel = require('planorama/basicModel');
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

 * Find a user by mongo id:
 * User.findById(id, callback);
 * Or by other fields
 * User.findOne({<filter object>}, callback);
 *
 **********************************************************************************************************************/
var User = BaseModel.extend({

    username: '',
    hashedPassword: '',


    /**
     * hash
     *
     * @info defines a username-dependant hash algorithm for password storing and checking
     *
     * @param password
     * @returns {*}
     */
    hash: function(password) {
      if (!password) throw new Error('Cannot hash empty password');
      return crypto.createHash('md5').update(password + 'ds3qh2zekq9jrez' + this.username).digest('hex');
    },

    /**
     * validPassword
     * @param password
     * @returns {boolean}
     */
    validPassword: function(password) {
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
    resetPassword: function(password, oldPassword) {
      if(!this.validPassword(oldPassword)){
        throw new Error('Invalid password');
      }
      if(!password){
        throw new Error('Empty password');
      }
      this.hashedPassword = this.hash(password);
      return this;
    }
  },

  /**
  static attributes:
  **/

  {

    _collectionName: 'users',
    _db: db,

    /**
     * create
     *
     * @info initialization comportment setting for different formats of input parameters
     * @param def
     */
    create: function(def){

      var newdef = {};
      var instance;

      // Checks parameter presence

      if (!def.username) throw new Error('No username provided');

      if (!(def.hashedPassword || def.password)) throw new Error('No password provided');

      // Instanciation

      newdef.username = def.username;
      if (def._id) {
        newdef._id = def._id;
      }
      instance = this._super(newdef);

      // Add the hashed password

      instance.hashedPassword = def.hashedPassword || instance.hash(def.password);

      return instance;
    },

    /**
     * initCollec
     *
     * @info re-initiates the Users collection (erase data and reset indexes)
     *
     * @param callback
     * @returns {*}
     */
    initCollec: function(callback) {
      function indexInit(collection, cb) {
        collection.ensureIndex({ username: 1 }, { unique: true }, cb);
      }
      return this.db.initCollec(this.getCollection(), indexInit, callback);
    }

  }
);


module.exports = User;