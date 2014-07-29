/* Defines a GET route for home page. */

var index = function(req, res) {
  if(!req.user) {
    // no username provided => will display main index
    return res.render('index', {
      messages: req.flash()
    });
  }
  res.render('index', {
    // no username provided => will display logged-in page
    username: req.user.username,
    messages: req.flash()
  })
};

function addRoutes(app){
  app.get('/', index);
}


module.exports = addRoutes;