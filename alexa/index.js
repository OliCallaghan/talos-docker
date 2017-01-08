const express = require('express')
const app = express()

const Alexa = require("./controllers/alexa")

app.get("/alexa", Alexa.app)
app.get("/briefing", Alexa.briefing)

app.listen(3000, function () {
	console.log('Talos Alexa server listening on port 3000!')
})