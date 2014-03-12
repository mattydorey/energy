var http = require('http');
var express = require('express');
var accountSid = 'AC705e42b0f48c9dc4aa055dd830a816ad';
var authToken = "dfec68a266acd8126f76127c86e30364";
var client = require('/usr/local/lib/node_modules/twilio')(accountSid, authToken);

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

var app = express();
app.use(express.urlencoded());

//Create a route to resp
app.post('resondToVoiceCall', function(req,res) {
	//Validate that this request came from TW
	if(twilio.validateExpressRequest(req, authToken)) {
		var twiml = new twilio.TwimlResponse();

		twiml.say('Hi, thanks for sending!');

		res.type('text/xml');
		res.send(twiml.toString());
	}
	else {
		res.send('you are not twilio. f off');
	}
});

var count = 30;

var counter = setInterval(timer, 60000);

function timer() {
	count = count -1;
	console.log(count);
	if (count == 0) {
		console.log('count is zerooo');
		client.sms.messages.create({
    		body: "Matt TEST!!",
   			 to: "+14153172907",
   			 from: "+14155287545"
		}, function(err, message) {
    		process.stdout.write(message.sid);
		});
		count = 30;
	}


	//show seconds here
}

console.log('Server running at http...');
