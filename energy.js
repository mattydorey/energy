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
var $ = require ('jquery');
var dbConnection = redis.createClient();
var fs = require('fs');
//var Cal = require('./modules/calendar');
var S = require('string');
var wit = require('./src/wit');
var Message = require('./src/message');
var next_recipe_id = 0;
var Gapi = require('./modules/gapis');

//Setup DB Support 

/* Redis - Deploy to Heroku 
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var dbConnection = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
dbConnection.auth(redisURL.auth.split(":")[1]);
*/

var gapi = new Gapi();
var str = JSON.stringify(gapi);
console.log('gapi : ' + str);

var my_calendars = [],
	my_events = [],
    my_profile = {},
    my_email = '';

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger('dev'));
	app.use(app.router);
	app.use(express.urlencoded());
});

app.get('/gapi', function (req, res) {
	var locals = {
		title: 'this is my app',
		url: gapi.url
	};
	console.log (gapi.url);
	res.render('index.jade', locals);
});

app.get('/oauth2callback', function(req, res) {
	var code = req.query.code;
	console.log(code);
	gapi.newToken(code, function (error, result) {
		// cal.storeToken(result);
	});
  	var locals = {
        title: 'What are you doing with yours?',
        url: gapi.url
    };
  	res.render('index.jade', locals);
});

// app.get('/cal', function(req, res){
//   var locals = {
//     title: "These are your calendars",
//     user: my_profile.name,
//     events: my_calendars,
//     email: my_email
//   };
//   res.render('cal.jade', locals);
// });

//Add Users Into DB
var users = ["+14153172907", "+14158893323"]; 
			//JOSH: "+14158893323"
			//CARSON: "+13107709638"
			//HEWITT: "+17754000215" 

console.log('\n<<<<<< ADDING TEST USERS TO DB >>>>>>');

users.forEach(function(user){
	dbConnection.incr('next_user_id', function(error, result) {
    	if (error) console.log('Error: ' + error);
    	else {
    		next_user_id = result;
    		//console.log('Next user id is: ' + next_user_id);
    		insertUser(next_user_id, user);
    	}
	});
});

var next_user_id = 0;

function insertUser(next_user_id, user) {
	dbConnection.hset('user:' + next_user_id, 'phone', user, function(error, result) {
		if (error) console.log('Error: ' + error);	
		else console.log('User ' + next_user_id + ' added into DB - ' + user);
	});

	dbConnection.set('user:' + user, next_user_id, function(error, result) {
		if (error) console.log('Error: ' + error);	
		else {}
	});
}

var next_message_id = 1;

//Resond to Incoming SMS

app.post('/respondToSms', function(req, res) {       
	var message = new Message();
	message.messagePost(req, res);
});

//Interval to send outgoing SMS
var minutes = 60;
var counter = setInterval(timer, 60000);

function timer() {
	minutes = minutes -1;
	console.log("T- " + minutes + " minutes until fire.");
	
	if (minutes == 0) {
		
		var users = ["+14153172907"]; 
			//JOSH: "+14158893323"
			//CARSON: "+13107709638"
			//HEWITT: "+17754000215" 
			//TOM: "+16502481774"

		var question = "Rate your mindset between 1 and 5:";
	
		users.forEach(function(user){
			console.log(user);
			client.sms.messages.create({
	    		body: question,
	   			to: user,
	   			from: "+14155287545"
			}, function(err, message) {
	    		process.stdout.write(message.sid);
	    		console.log(err);
			});
		});
		minutes = 60;
	}
}

//Server setup
var port = Number(process.env.PORT || 5003);
app.listen(port, function() {
	console.log("Listening on " + port);
});
