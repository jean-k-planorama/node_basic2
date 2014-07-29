
/** Defines a shared variable config to be accessed by all modules depending on the database **/

var env = process.env.NODE_ENV || 'develop';

var configs = {
  develop: {
    dbName: 'develop'
  },
  mocha: {
    dbName: 'mocha'
  }
};
// for now on, only the dbName is needed but access parameters can be added here

var config = configs[env] || { dbName: env};


module.exports = config;