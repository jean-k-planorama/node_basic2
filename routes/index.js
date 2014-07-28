/* GET home page. */

var index = function(req, res) {
  if(!req.user) {
    return res.render('index', {
      messages: req.flash()
    });
  }
  res.render('index', {
    username: req.user.username,
    messages: req.flash()
  })
};

function addRoutes(app){
  app.get('/', index);
}

module.exports = addRoutes;