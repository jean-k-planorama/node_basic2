
// Defines a shared MongoHandler object for other modules to access

var MongoHandler = require('planorama/mongohandler');
var config = require('../modules/config');

module.exports = MongoHandler(config.dbName, config.dbPath);