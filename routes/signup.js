/* Signup post request page */

var User = require('../models/user');

var signup = function(req, res){
  var user;
  var username = req.body.newUsername;
  var password = req.body.newPassword;
  if(!username){
    req.flash('error', 'Invalid username');
    return res.redirect('/');
  }
  try{
    user = User({username: username, password: password});
  }catch(err){
    req.flash('error', err.message);
    return res.redirect('/');
  }
  user.save(function(err, saved_user){
    err = (err || !saved_user) && new Error('Invalid username or already exists');
    if(err){
      req.flash('error', err.message);
      return res.redirect('/');
    }
    req.flash('success', username + ' has been successfully created !');
    return res.redirect('/');
  });
};


function addRoutes(app){
  app.post('/signup', signup);
}

module.exports = addRoutes;