const Site = require('../models/Site')

/*
 * Create the Site
 */

exports.create = function(params, callback) {
	Site.findOne({ url: params.url }, function(err, doc){
		if (doc) { // duplicate
			module.exports.update(doc._id, params, function(err, doc) { // update existing
				doc.duplicate = true
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
			for (let key in params) {
				if (!params.hasOwnProperty(key)) continue
				else {
					site[key] = params[key]
				}
			}
			site.save(function(err) {
				callback(err, site)
			})
		} else {
			callback(err, site)
		}
	})
}