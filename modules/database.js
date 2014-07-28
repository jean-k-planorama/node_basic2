var MongoHandler = require('planorama/mongohandler');
var config = require('../modules/config');

module.exports = MongoHandler(config.env);