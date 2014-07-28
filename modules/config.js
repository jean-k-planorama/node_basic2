
var env = process.env.NODE_ENV || 'develop';

var configs = {
//  develop: {
//    dbName: 'develop'
//  },
//  mocha: {
//    dbName: 'mocha'
//  }
};

var config = configs[env] || { dbName: env};

module.exports = config;