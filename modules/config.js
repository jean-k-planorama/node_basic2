
/** Defines a shared variable config to be accessed by all modules depending on the database **/

var env = process.env.NODE_ENV || 'dev';

var configs = {
  'develop': {
    dbName: 'dev'
  },
  'unit-test': {
    dbName: 'unit-test'
  },
  'staging': {
    dbName: 'staging'
  },
  'production': {
    dbName: 'production'
  }
};
// for now on, only the dbName is needed but access parameters can be added here

var config = configs[env] || { dbName: env};


module.exports = config;