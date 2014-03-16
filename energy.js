var http = require('http');
var express = require('express');
var accountSid = 'AC5ddb5f9d5de10a5423ef84a83c4d68ef';
var authToken = "3d1fbe499b7e0f73e9a957283168890b";
var util = require('util');
var twilio = require('twilio');
var client = require('twilio')(accountSid, authToken);
var app = express();

app.get('/', function(req, res){
	res.send('..Hellsso World...');
});

app.configure(function () {
    app.use(express.urlencoded());
});

//Twilio request authentication with custom URL
app.post('/respondToSms', twilio.webhook(authToken), function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('This HTTP request came from Twilio!');
    response.send(twiml);
});


var count = 60;

var counter = setInterval(timer, 60000);

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

var port = Number(process.env.PORT || 5001);
app.listen(port, function() {
	console.log("Listening on " + port);
});