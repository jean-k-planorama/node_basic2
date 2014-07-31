
/** Defines a shared variable config to be accessed by all modules depending on the database **/

// External dependencies

_ = require('lodash');


// Contains model configurations used to generate the config object

var configModels = {
  'dev': {
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


/**
 * config object (singleton):
 * {
 *  env: contains the current environment (== process.env.NODE_ENV),
 *  dbName: ...,
 *  (dbPath): ..,
 *  (<other db credentials...>): ...,
 *  set: function of env initiating all parameters above
 */
var config = {
  set: function(env){
    var model = configModels[env];
    if (!model) throw new Error('Unknown environment: ' + env);

    process.env.NODE_ENV = env;  // reset the environment variable to the new env
    config.env = env;
    // add properties from the model
    _.extend(config, model);
    return config;
  }
};

// Make default config (can be overwritten using config.set(newEnv))
config.set(process.env.NODE_ENV || 'dev');

module.exports = config;