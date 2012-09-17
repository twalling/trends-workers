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

  var search = function() {
    var location = common.constants.CURRENT_LOCATION;
    var geocode = [location.lat, location.lon, location.radius].join(',');
    client.search('fenway', {geocode: geocode, result_type: 'recent'}, function(err, data) {
      if (err) {
        return console.error(err);
      }
      var ids = _.pluck(data.results, 'id_str');
      Post.findByExternalIds(ids, function(err, posts) {
        if (err) {
          return console.log(err);
        }
        console.log('checking twitter results');
        var existing = {};
        _.each(posts, function(post) {
          existing[post.externalId] = post;
        });
        _.each(data.results, function(tweet) {
          if (!existing[tweet.id_str]) {
            console.log('found tweet with id: ' + tweet.id_str);
            var post = new Post({
              type: common.constants.POST_TYPES.TWITTER.type,
              externalId: tweet.id_str,
              date: new Date(tweet.created_at),
              title: tweet.text
            });
            post.save();
          }
        });
      });
    });
  };

  return search;
};