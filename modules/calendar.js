var moment = require('moment');
//var gapi = require('./gapis');
var Gapi = require('./gapis');
var moment = require('moment');

function Calendar(token) {
	var go = new Gapi(token);

}

module.exports = Calendar;



// function Calendar() {
// 	//this.phoneNumber = phoneNumber;
// 	console.log('in calendar');

// 	// var my_calendars = [],
// 	//     my_events = [],
//  //        my_profile = {},
//  //        my_email = '';

//  //    var that = this;

// 	var accessToken;
// 	var config = {
//     	'client_id': '570658000106-eqpmv5dri7e6lk2lpsjpa3c9eclb4nj0.apps.googleusercontent.com',
//     	'secret': 'gl_xoLgVuXg8Wezsl_uAh2UA',
// 	}; 

// 	this.getUserInfo = function (tokens, cb) {
		
// 		gapi.auth.authorize(config, function() {
//         	accessToken = gapi.auth.getToken().access_token;
//         	console.log('We have got our token....');
//         	console.log(accessToken);
//        		console.log('We are now going to validate our token....');
//         //validateToken();
// 	}

// 	// this.listEvents = function (tokens, calendarId, entities, date, cb) {
// 	// 	gapi.auth.setToken(tokens);
// 	// 	gapi.cal.calendarList.list().withAuthClient(gapi.client).execute (function (error, result) {
// 	//    		var string = JSON.stringify(result);
// 	// 		//console.log('CAL results: ' + string);
// 	//     	for (var i = result.items.length - 1; i >= 0; i--) {
// 	//     		my_calendars.push(result.items[i].summary);
// 	//     	};
// 	//   	});

// 	//   	gapi.cal.events.list({
// 	//   		calendarId:'1@m3m3n70.com', 
// 	//   		singleEvents: true,
// 	//   		orderBy: 'startTime',
// 	//   		showDeleted: false,
// 	//   		timeMin:'2014-04-13T02:21:50-07:00',
// 	//   		timeMax: '2014-05-15T02:21:50-07:00'
// 	//   			}).withAuthClient(gapi.client).execute 
// 	//   		(function (error, result) {
// 	// 	    	for (var i = result.items.length - 1; i >= 0; i--) {
// 	// 	  			my_events.push(result.items[i].summary);
// 	// 	    	};
// 	// 	    	var eventsString = JSON.stringify(my_events);
// 	// 			var eventsJSON = JSON.parse(eventsString);
// 	// 			//console.log(eventsJSON);
// 	// 			console.log(my_events);
// 	//   	});
// 	// }

// 	// this.setToken = function (tokens, cb) {
// 	// 	var tokenString = JSON.stringify(tokens);
// 	// 	gapi.client.credentials = tokens;
// 	// 	cb(null, tokens);
//  //  	}

// 	// this.newToken = function (code, cb) {
// 	// 	gapi.client.getToken(code, function(err, tokens){
//  //    		var tokenString = JSON.stringify(tokens);
//  //    		gapi.client.credentials = tokens;
//  //    		that.storeToken (tokenString);
//  //    		cb(null, tokens);
//  //  		});
// 	}

//   	// this.storeToken = function (token) { 
//   	// 	var db = new Data();
//   	// 	db.insertRecord('1', 'gapi', 'name', phoneNumber);
//   	// 	db.insertRecord('1', 'gapi', 'token', token);
//   	// 	db.insertMember('1', 'gapi', 'name', phoneNumber);
//   	// }

//   	// this.existingToken = function (phoneNumber, cb) {

//   		// db.getMember('1415', function (error, result) {
//   		// 	console.log(result);
//   		// });

// 		// console.log(phoneNumber);  	
// 		// console.log('in existing token');	
//   		// db.getMember(phoneNumber, function (error, result) {
//   		// 	db.getRecord(result, 'token', function (error, result) {
//   		// 		console.log('returned token from db... is: ' + result);
//   		// 		cb(null, result);
//   		// 	});
//   		// });
//   	// }
// }

// module.exports = Calendar;


// var today = moment().format('YYYY-MM-DDThh:mm:ss'+'Z'); console.log('Today is: ' + today);

// var tomorrow = moment().add('days', 1).format(); console.log('Tomorrow is: ' + tomorrow);
// var yesterday = moment().add('days', -1).format(); console.log('Yesterday was: ' + yesterday);

// var nextWeek = moment().add('days', 7).format(); console.log('Next week is: ' + nextWeek);
// var lastWeek = moment().add('days', -7).format(); console.log('Last week is: ' + lastWeek);

// var nextMonth = moment().add('months', 1).format(); console.log('Next month is: ' + nextMonth);
// var lastMonth = moment().add('months', -1).format(); console.log('Last month is: ' + lastMonth);


