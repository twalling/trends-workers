var Twitter = require('ntwitter');
var _ = require('underscore');
var common = require('trends-common');
var Post = common.models.Post;

module.exports.create = function(config) {
  var client = new Twitter({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token_key: config.twitter.accessTokenKey,
    access_token_secret: config.twitter.accessTokenSecret
  });

  var getDailyTrends = function() {
    client.getDailyTrends({exclude: 'hashtags'}, function(err, results) {
      if (err) {
        console.error(err);
        return;
      }
      _.each(_.chain(results.trends).toArray().first().value(), function(trend) {
        console.log(trend.query);
      });
    });
  };

  return getDailyTrends;
};