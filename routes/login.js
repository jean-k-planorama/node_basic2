var passport = require('passport');

function addRoutes(app){
  app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
      failureRedirect: '/',
      successFlash: 'Successfully logged in',
      failureFlash: 'Failed to log in' })
  );
}

module.exports = addRoutes;