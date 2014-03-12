var http = require('http');
var express = require('express');
var accountSid = 'AC705e42b0f48c9dc4aa055dd830a816ad';
var authToken = "dfec68a266acd8126f76127c86e30364";
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);
var app = express();

app.get('/', function(req, res){
	res.send('Hello World...');
});

app.configure(function () {
    app.use(express.urlencoded());
});

//Create a route to resp
app.post('/respondToSms', function(req,res) {
	//Validate that this request came from TW
	if(client.validateExpressRequest(req, authToken)) {
		var twiml = new client.TwimlResponse();

		twiml.Sms('Hi, thanks for sending!');

		res.type('text/xml');
		res.send(twiml.toString());
	}
	else {
		res.send('you are not twilio. f off');
	}
});

var count = 30;

var counter = setInterval(timer, 600000);

function timer() {
	count = count -1;
	console.log(count);
	if (count == 0) {
		console.log('count is zerooo');
		client.sms.messages.create({
    		body: "Rate your energy between 1 and 5:",
   			 to: "+14153172907",
   			 from: "+14155287545"
		}, function(err, message) {
    		process.stdout.write(message.sid);
		});
		count = 30;
	}
}

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});