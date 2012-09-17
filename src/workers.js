var env = process.env.NODE_ENV || 'development';
var _ = require('underscore');
var common = require('trends-common');
var config = common.config[env];

var JOB_INTERVAL = 1000 * 10;

common.lib.mongo.connectToMongo(config.mongodb, function() {
  var jobs = [
    require('./jobs/instagram').create(config),
    require('./jobs/twitter').create(config)
  ];

  var runJobs = function() {
    _.each(jobs, function(job) {
      job();
    });
  };

  setInterval(function() {
    runJobs();
  }, JOB_INTERVAL);

  runJobs();
});
