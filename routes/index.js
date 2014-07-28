/* GET home page. */
exports.index = function(req, res) {
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
