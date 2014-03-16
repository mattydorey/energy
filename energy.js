var http = require('http');
var express = require('express');
var accountSid = 'AC705e42b0f48c9dc4aa055dd830a816ad';
var authToken = "dfec68a266acd8126f76127c86e30364";
var util = require('util');
var twilio = require('twilio');
//var client = require('twilio')(accountSid, authToken);
var app = express();

app.get('/', function(req, res){
	res.send('..Hellsso World...');
});

app.configure(function () {
    app.use(express.urlencoded());
});

    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {

            var POST = qs.parse(body);

            //validate incoming request is from twilio using your auth token and the header from Twilio
            var token = authToken,
                header = req.headers['x-twilio-signature'];

            //validateRequest returns true if the request originated from Twilio
            if (twilio.validateRequest(token, header, 'http://damp-beach-4762.herokuapp.com/respondToSms', POST)) {
                //generate a TwiML response
                var resp = new twilio.TwimlResponse();
                resp.say('hello, twilio!');

                res.writeHead(200, { 'Content-Type':'text/xml' });
                res.end(resp.toString());
            }
            else {
                res.writeHead(403, { 'Content-Type':'text/plain' });
                res.end('you are not twilio - take a hike.');
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type':'text/plain' });
        res.end('send a POST');
    }

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