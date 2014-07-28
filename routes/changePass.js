/* Change password request */

var User = require('../models/user');

var changePass = function(req, res) {
  var user = User(req.user);
  try{
    user.resetPassword(req.body.newPassword, req.body.oldPassword)
  }catch(err) {
    req.flash('error', err.message);
    return res.redirect('/');
  }
  user.save(function(err, saved_user) {
    err = (err || !saved_user) && new Error('An error occured');
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/');
    }
    req.flash('success', 'Your password has been successfully changed !');
    return res.redirect('/');
  });
};

function addRoutes(app){
  app.post('/change-pass', changePass);
}

module.exports = addRoutes;