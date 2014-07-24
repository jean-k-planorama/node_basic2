require('chai').should();
var path = require('path');
var User = require('planorama/user');
var request = require('supertest');
var app = require(path.join(process.cwd(), 'app'));

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    })
  })
});


describe('User', function(){
  
  var username = 'Luna';

  var luna = new User({username: username, password: 'pizza33'});

  before(function(done){
    User.remove({username: username}, done);
  });

  describe('#save()', function(){
    it('should save without error', function(done){
      luna.should.not.have.property('_id');
      luna.save(function(err, saved_user){
        luna.should.have.property('_id');
        saved_user.username.should.equal(luna.username);
        done(err, saved_user);
      });
    })
  });

  describe('#findOne()', function(){
    it('should return an object with the same properties', function(done) {
      User.findOne({username: username}, function (err, luna2) {
        (!!luna2).should.equal(true);
        luna._id.toString().should.equal(luna2._id.toString());
        luna.hashed_password.should.equal(luna2.hashed_password);
        luna.username.should.equal(luna2.username);
        done();
      });
    })
  });

  describe('#changePassword()', function(){
    it('should be able to change the password', function(done){
      luna.validPassword('pizza33').should.equal(true);
      luna.validPassword('pizza66').should.equal(false);
      User.findUser(username, function(err, item){
        !err && item.validPassword('pizza66').should.equal(false);
        !err && item.validPassword('pizza33').should.equal(true);
        item.setPassword('pizza66', 'pizza33');
        !err && item.validPassword('pizza66').should.equal(true);
        !err && item.validPassword('pizza33').should.equal(false);
        User.findUser(username, function(err, item2){
          !err && item2.validPassword('pizza66').should.equal(false);
          !err && item2.validPassword('pizza33').should.equal(true);
          item.save(function(err, val){
            User.findUser(username, function(err, item3){
              !err && item3.validPassword('pizza66').should.equal(true);
              !err && item3.validPassword('pizza33').should.equal(false);
              done();
            });
          });

        });
      });
    })
  });

  after(function(done){
    User.remove({username: username}, done);
  });

});

describe('requests', function(){

  describe('#/index', function(){
    it('should respond', function(done){
      request(app)
        .get('/')
        .expect(200, done)
    })
  })
});