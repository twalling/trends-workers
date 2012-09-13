var instagram = require('instagram-node-lib');
var _ = require('underscore');
var common = require('trends-common');
var Post = common.models.Post;

module.exports.create = function(config) {
  instagram.set('client_id', config.instagram.clientId);
  instagram.set('client_secret', config.instagram.clientSecret);

  var getPopularMedia = function() {
    var handleComplete = function(data) {
      _.each(data, function(post) {
        console.log(post.images.thumbnail.url);
      });
    };
    var handleError = function(err) {
      console.log(err);
    };
    instagram.media.popular({complete: handleComplete, error: handleError});
  };

  return getPopularMedia;
};