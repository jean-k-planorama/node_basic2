
// Dependencies

require('chai').should();
var async = require('async');
var path = require('path');
var request = require('supertest');


// Define environment (!WARNING: Do before requiring other items)

require('../modules/config').set('unit-test');

// Internal objects

var db = require('../modules/database');
var User = require('../models/user');
var app = require(path.join(process.cwd(), 'app'));


before(function init_test_db(done){
  return db.open(done);
});

describe('User', function() {
  
  var username = 'Luna';

  var luna = User.create({username: username, password: 'pizza33'});

  before(function(done) {
    User.remove({username: username}, done);
  });

  describe('#init()', function() {
    it('should have hashed the password', function (done) {
      luna.should.not.have.property('password');
      luna.should.have.property('hashedPassword');
      luna.validPassword('pizza33').should.equal(true);
      done();
    })
  });

  describe('#save()', function() {
    it('should save without error', function(done) {
      luna.should.not.have.property('_id');
      luna.save(function(err, saved_user){
        luna.should.have.property('_id');
        saved_user.username.should.equal(luna.username);
        done(err, saved_user);
      });
    })
  });

  describe('#findOne()', function() {
    it('should return an object with the same properties', function(done) {
      User.findOne({username: username}, function (err, luna2) {
        (!!luna2).should.equal(true);
        luna._id.toString().should.equal(luna2._id.toString());
        luna.hashedPassword.should.equal(luna2.hashedPassword);
        luna.username.should.equal(luna2.username);
        done();
      });
    })
  });

  describe('#changePassword()', function() {
    it('should be able to change the password', function(done) {

      function checkPassword(expected, notExpected){
        return function(user, cb) {
          if(!user) {throw new Error('Undefined user');}
          user.validPassword(expected).should.equal(true);
          user.validPassword(notExpected).should.equal(false);
          return cb(null, user);
        };
      }
      function retrieve(user, cb){
        return User.findOne({username: user.username}, function(err, item){
          return cb(null, item);
        });
      }
      function saveUser(user, cb) {
        return user.save(function () {
          return cb(null, user);
        });
      }
      function changePassword(newPass, oldPass){
        return function(user, cb) {
          if(!user) {throw new Error('Undefined user');}
          try {
            user.resetPassword(newPass, oldPass);
          } catch (e) {
          }
          return cb(null, user);
        };
      }

      async.waterfall(
        [
          function(cb){
            return cb(null, luna);
          },
          checkPassword('pizza33', 'pizza66'),
          saveUser,
          // tries with wrong old password:
          changePassword('pizza66', 'pizza44'),
          // (stays unchanged):
          checkPassword('pizza33', 'pizza66'),
          // tries with correct old password:
          changePassword('pizza66', 'pizza33'),
          // (successful change):
          checkPassword('pizza66', 'pizza33'),
          // reloads from database:
          retrieve,
          // (unsaved changes are uneffective):
          checkPassword('pizza33', 'pizza66'),
          // reloads modified user and saves it:
          function(user, cb){
            return cb(null, luna);
          },
          saveUser,
          // reloads from database:
          retrieve,
          // (effective changes):
          checkPassword('pizza66', 'pizza33')
        ],
        done
      );
    })
  });

  after(function(done){
    User.remove({username: username}, done);
  });

});

describe('requests', function(){

  describe('#GET / (index)', function(){
    it('should respond', function(done){
      request(app)
        .get('/')
        .expect(200, done)
    })
  })
});

//// SKELETON
//describe('#GET / (index)', function () {
//  before(function () { /* create selenium driver */ });
//
//  describe("when used by a logged in user", function () {
//    before(function () { /* log in */ });
//
//    it(...
//
//      it(...
//
//      after(function () { /* log out */ });
//  });
//
//  describe("when used by a logged out user", function () {
//    it(...
//
//      it(...
//  });
//  after(function () { /* shut down the driver */ });
//});