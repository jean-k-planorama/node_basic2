
var BBO = require('bluebirds').Object;

var Config = BBO.extend({
  env: undefined,

  init: function () {
    this.env = this.env || process.env.NODE_ENV;
  }

});

module.exports = Config.create();