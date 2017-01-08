const Site = require('../models/Site')

/*
 * Create the Site
 */

exports.create = function(params, callback) {
	Site.findOne({ url: params.url }, function(err, doc){
		if (doc) { // duplicate
			module.exports.update(doc._id, params, function(err, doc) { // update existing
				callback(err, doc) // return as usual
			})
		} else { // create new
			console.log("Creating site", params.url)
			Site.create(params, function(err, site) {
				callback(err, site)
			})
		}
	})
}

/*
 * Read the Site
 */

exports.read = function(id, callback) {
	Site.findById(id, function(err, site) {
		callback(err, site)
	})
}

/*
 * Delete the Site
 */

exports.delete = function(id, callback) {
	Site.remove({ _id: id }, function(err) {
		callback(err)
	})
}

/*
 * Update the Site
 */

exports.update = function(id, params, callback) {
	Site.findById(id, function(err, site) {
		if (site) {
			site.user = params.user
			site.container = params.container
			site.refreshRate = params.refreshRate
			site.info = params.info
			site.save(function(err) {
				callback(err, site)
			})
		} else {
			callback(err, site)
		}
	})
}