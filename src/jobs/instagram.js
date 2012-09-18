var instagram = require('instagram-node-lib');
var _ = require('underscore');
var common = require('trends-common');
var Post = common.models.Post;

module.exports.create = function(config) {
  instagram.set('client_id', config.instagram.clientId);
  instagram.set('client_secret', config.instagram.clientSecret);

  var search = function() {
    var location = common.constants.CURRENT_LOCATION;

    var handleComplete = function(data) {
      var ids = _.pluck(data, 'id');
      Post.findByExternalIds(ids, function(err, posts) {
        if (err) {
          return console.log(err);
        }
        console.log('checking instagram results');
        var existing = {};
        _.each(posts, function(post) {
          existing[post.externalId] = post;
        });
        _.each(data, function(instagram) {
          if (!existing[instagram.id]) {
            console.log('found instagram with id: ' + instagram.id);
            var post = new Post({
              type: common.constants.POST_TYPES.INSTAGRAM.type,
              externalId: instagram.id,
              // Instagram time is in second, convert to ms
              date: new Date(parseInt(instagram.created_time, 10) * 1000),
              // standard_resolution is also available
              media: instagram.images.thumbnail.url
            });
            if (instagram.caption && instagram.caption.text) {
              post.title = instagram.caption.text;
            }
            post.save();
          }
        });
      });
    };
    var handleError = function(err) {
      console.log(err);
    };
    instagram.media.search({
      lat: location.lat,
      lng: location.lon,
      distance: location.radius,
      complete: handleComplete,
      error: handleError
    });
  };

  return search;
};