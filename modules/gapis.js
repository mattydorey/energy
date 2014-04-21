var googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2,
    calendar_auth_url = '',
    my_events,
    client;

function Gapi (token) {
	var oauth2Client =
	    new OAuth2('570658000106-eqpmv5dri7e6lk2lpsjpa3c9eclb4nj0.apps.googleusercontent.com', 
	    	'gl_xoLgVuXg8Wezsl_uAh2UA', 
	    	'http://localhost:5003/oauth2callback');

	var calendar_auth_url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.me'
	});

	this.newToken = function (code, cb) {
		oauth2Client.getToken(code, function (error, result) {
			console.log(result);
			cb(error, result);
		});
	}

	oauth2Client.credentials = {
		access_token: token
	};

	this.getPlus = function () {
		googleapis
			//.discover('calendar', 'v3')
			.discover('plus', 'v1')
			.discover('oauth2', 'v2')
			.execute(
				function (error, result) {
					client = result;
					console.log('res: ' + result);
					client
	  					.plus.people.get({ userId: 'me' })
	  					.withAuthClient(oauth2Client)
	  					.execute(function (error, client) {
	  						if (!err)
	  						callback(client);
	  					});
		 		}
		 );
	}
	callback();

	function callback (clients) {
		console.log('client object is: ' + clients);
		exports.url = calendar_auth_url;
		console.log('url is: ' + calendar_auth_url);
	};


	// client.calendar.events.list({
 //  		calendarId:'1@m3m3n70.com', 
 //  		singleEvents: true,
 //  		orderBy: 'startTime',
 //  		showDeleted: false,
 //  		timeMin:'2014-04-13T02:21:50-07:00',
 //  		timeMax: '2014-05-15T02:21:50-07:00'
 //  		})
	// .withAuthClient(oauth2Client)
	// .execute 
 //  		(function (error, result) {
	//   //   	for (var i = result.items.length - 1; i >= 0; i--) {
	//   // 			my_events.push(result.items[i].summary);
	//   //   	};
	//   //   	var eventsString = JSON.stringify(my_events);
	// 		// var eventsJSON = JSON.parse(eventsString);
	// 		// console.log(my_events);
	// 		console.log(result);
	// 	});

	
}


exports.url = calendar_auth_url;
module.exports = Gapi;

// var gapi = require('googleapis'),
//     OAuth2Client = gapi.OAuth2Client,
//     	client = '570658000106-eqpmv5dri7e6lk2lpsjpa3c9eclb4nj0.apps.googleusercontent.com',
//     	secret = 'gl_xoLgVuXg8Wezsl_uAh2UA',
//     	redirect = 'http://localhost:5002/oauth2callback',
//     calendar_auth_url = '',
//     oauth2Client = new OAuth2Client(client, secret, redirect);

// exports.ping = function() {
// 	console.log('pong');
// };

// calendar_auth_url = oauth2Client.generateAuthUrl({
// 	access_type: 'offline',
// 	scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
// });

// gapi
// 	.discover('calendar', 'v3')
// 	.discover('oauth2', 'v2')
// 	.execute(function(err, client){
//  	if(!err)
//  	callback(client);
//  });

// function callback (clients) {
// 	console.log('client object is: ' + clients);
// 	exports.cal = clients.calendar;
// 	exports.oauth = clients.oauth2;
// 	exports.client = oauth2Client;
// 	exports.url = calendar_auth_url;
// };

// module.exports = gapi;