var http = require('http');
var express = require('express');
var accountSid = 'AC705e42b0f48c9dc4aa055dd830a816ad';
var authToken = "dfec68a266acd8126f76127c86e30364";
var util = require('util');
process.env.TWILIO_ACCOUNT_SID = accountSid;
var twilio = require('twilio');
//var client = require('twilio')(accountSid, authToken);
var app = express();

app.get('/', function(req, res){
	res.send('..Hellsso World...');
});

app.configure(function () {
    app.use(express.urlencoded());
});

//Twilio request authentication with custom URL

var fullValidation = twilio.webhook(authToken, {
    url:'https://damp-beach-4762.herokuapp.com/respondToSms'
});

app.post('/respondToSms', fullValidation, function(req, res) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('holy biscuits');
    response.send(twiml);
});

//var count = 60;

//var counter = setInterval(timer, 60000);
/*
function timer() {
	count = count -1;
	console.log("T- " + count + " minutes until fire.");
	if (count == 0) {
		client.sms.messages.create({
    		body: "Rate your energy between 1 and 5:",
   			 to: "+14153172907",
   			 from: "+14155287545"
		}, function(err, message) {
    		process.stdout.write(message.sid);
		});
		count = 60;
	}
}
*/

var port = Number(process.env.PORT || 5001);
app.listen(port, function() {
	console.log("Listening on " + port);
});