var env = process.env.NODE_ENV || 'development';
var _ = require('underscore');
var common = require('trends-common');
var config = common.config[env];

common.lib.mongo.connectToMongo(config.mongodb, function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected to Mongo');

  var jobs = require('./jobs/').create(config);

  var runJobs = function() {
    _.each(jobs, function(job) {
      job();
    });
  };

  setInterval(runJobs, config.jobInterval);

  runJobs();
});
