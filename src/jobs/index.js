var instagram = require('./instagram');
var twitter = require('./twitter');

module.exports.create = function(config) {
	return [
		instagram.create(config),
		twitter.create(config)
	];
};
