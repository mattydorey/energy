var googleapis = require('googleapis');

function Gapi (access_token) {
	this.googleapis = googleapis;
	var calendar_auth_url = 'ss';
    var OAuth2 = googleapis.auth.OAuth2;
    var my_events;
    var client;
    this.access_token = access_token;
    var refresh_token;

	var oauth2Client =
	    new OAuth2('570658000106-eqpmv5dri7e6lk2lpsjpa3c9eclb4nj0.apps.googleusercontent.com', 
	    	'gl_xoLgVuXg8Wezsl_uAh2UA', 
	    	'http://localhost:5002/oauth2callback');

	oauth2Client.credentials = {
		access_token: access_token,
 	 	refresh_token: "1/LIGgqj_juoSU2n_k4niGqQUnp8WrJsmF3heapijfDdk"
	};

	this.oauth2Client = oauth2Client;

	this.url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		approval_prompt: 'force',
		scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.me'
	});

	this.newToken = function (code, cb) {
		oauth2Client.getToken(code, function (error, result) {
			cb(error, result);
		});
	}

	function callback (clients) {
		console.log('client object is: ' + clients);
		console.log('url is: ' + calendar_auth_url);
	};

}

module.exports = Gapi;