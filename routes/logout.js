

var logout = function(req, res){
  if(req.isAuthenticated()){
    req.logout();
    req.flash('success', 'Successfully logged out');
  }
  res.redirect('/');
};


function addRoutes(app){
  app.get('/logout', logout);
}

module.exports = addRoutes;