exports.get = function(req, res){
  if(req.isAuthenticated()){
    req.logout();
    req.flash('success', 'Successfully logged out');
  }
  res.redirect('/');
};