var http = require('http');
var express = require('express');
var accountSid = 'AC705e42b0f48c9dc4aa055dd830a816ad';
var authToken = "dfec68a266acd8126f76127c86e30364";
var util = require('util');
var client = require('twilio')(accountSid, authToken);
var app = express();
var qs = require('querystring');
var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var dbConnection = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
dbConnection.auth(redisURL.auth.split(":")[1]);

app.get('/', function(req, res){
	res.send('..Hellsso World...');
});

app.use(express.urlencoded());

app.post('/respondToSms', function(req, res) {
       
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(data) {
    	body += data;
    });

    req.on('end', function() {
		var now = new Date();
		var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");   		var data = qs.parse(body);
		function AddZero(num) { return (num >= 0 && num < 10) ? "0" + num : num + "";};		
		var jsonString = JSON.stringify(data);
    	var jsonDataObject = JSON.parse(jsonString);
    	messageResponse = jsonDataObject.Body;
    	dbConnection.set(strDateTime, messageResponse, redis.print);
		console.log(strDateTime);
		console.log(messageResponse);
	});

    res.type('text/xml');
    var smsResponse = res.send('<Response><Message>Tks</Message></Response>');
});

var minutes = 10;
var counter = setInterval(timer, 60000);

function timer() {
	minutes = minutes -1;
	console.log("T- " + minutes + " minutes until fire.");
	if (minutes == 0) {
		client.sms.messages.create({
    		body: "Rate your energy between 1 and 5:",
   			 to: "+14153172907",
   			 from: "+14155287545"
		}, function(err, message) {
    		process.stdout.write(message.sid);
		});
		minutes = 60;
	}
}

var port = Number(process.env.PORT || 5001);
app.listen(port, function() {
	console.log("Listening on " + port);
});