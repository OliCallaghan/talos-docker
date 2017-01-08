const moment = require('moment')
const uuidV1 = require('uuid/v1')
const Site = require("../models/Site")

function extractDomain(url) {
	var domain;
	if (url.indexOf("://") > -1) {
		domain = url.split('/')[2];
	}
	else {
		domain = url.split('/')[0];
	}

	domain = domain.split(':')[0];
	return domain;
}

function generateReport(callback) {
	Site.find(function(err,sites) {
		if (err) throw err
		let report = [],
		     upCount = 0,
		     downCount = 0
		     domains = []

		if (sites.length) {
			for (let i = 0; i < sites.length; i++) {
				let site = sites[i]
				let message = ""
				domains.push(extractDomain(site.url))
				if (i != 0) message = " "
				message += extractDomain(site.url) + " is " + site.info.status
				if (site.info.status == "up") {
					upCount++
					message += ", and is responding in " + site.info.latency + " milli seconds"
				} else {
					downCount++
				}
				report.push(message)
			}
			report += "."
		} else {
			report = "You have no sites set up. Login to your Taeloss dashboard to add one."
		}
		if (upCount == sites.length) {
			report = "All looks good. " + report
		} else {
			let intro = downCount + " out of your " + sites.length + " sites "
			if (downCount > 1) intro += "are"
			else intro += "is"
			report = intro + " down. " + report
		}
		report += " This report is current as of " + moment().fromNow()
		callback(report)
	})
}

exports.app = function(req, res, next) {
	generateReport(function(report) {
		console.log("Sending report to Alexa for " + domains.join(", "))
		res.json({
			version: 1.0,
			response: {
				outputSpeech: {
					type: "PlainText",
					text: report
				},
				card: {
					type: "Simple",
					content: "Talos report",
					title: "Talos"
				},
				reprompt: {
					outputSpeech: {
						type: "PlainText",
						text: report
					}
				},
				shouldEndSession: true
			}
		})
	})
}

exports.briefing = function(req, res, next) {
	generateReport(function(report) {
		res.json([
			{
				uid: "urn:uuid:"+uuidV1(),
				updateDate: moment().format("YYYY-MM-DDTHH:mm:ss")+".0Z",
				titleText: "Talos report",
				mainText: report,
				redirectionUrl: "https://finnian.io"
			}
		])
	})
}