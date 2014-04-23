var Gapi = require('./gapis');
var datetime = require('./datetime');
var moment = require('moment');

function Calendar(access_token, entities, cb) {
	var gapi = new Gapi(access_token);
	this.cb = cb;
	var entitiesString = JSON.stringify(entities);
	var entitiesObj = JSON.parse(entitiesString);
	if (entitiesObj.datetime) {
		var entitiesFrom = entitiesObj.datetime.value.from;
		var entitiesTo = entitiesObj.datetime.value.to;
		var from = moment(entitiesFrom).format();
		var to = moment(entitiesTo).format();
	}

	var calendarType = entities.calendarType.value;	//crashed app if null
	var that = this;
	var my_events = [];

	gapi.googleapis
			.discover('calendar', 'v3')
			.discover('oauth2', 'v2')
			.withAuthClient(gapi.oauth2Client);

	this.eventNext = function (error, result) {
  		if (error) console.log(error);
  		else {	
  			var start = [];
  			for (var i = 0; i < result.items.length; i++) {
  				var startTime = result.items[i].start.dateTime
  				startTime = moment(startTime).format();
  				if (startTime < from) {
  					console.log(startTime + ' - removing from resultset');
  				} else {
  					//if location
  					start.push(result.items[i].start.dateTime);
  					var time = moment(start[i]).format('H:mm');
					my_events.push(result.items[i].summary + ' at ' + time);
  				}
  			}
  			//time diff
			var now  = moment().format("DD/MM/YYYY HH:mm:ss");
			var then = moment(start[0]).format("DD/MM/YYYY HH:mm:ss");
			var ms = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
			var d = moment.duration(ms);
			var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
			var response = my_events[0] + '\n' + s + ' from now.' 
  			cb(error, response);
  		}
	}

	//Need to add map GPS info // directions
	this.eventLocation = function (error, result) {
  		if (error) console.log(error);
  		else {	
  			if (result.items[0].location) {
	  			var location = [];
	  			for (var i = 0; i < result.items.length; i++) {
	  			  	var startTime = result.items[i].start.dateTime
	  			  	if (startTime < from) {
  						console.log(startTime + ' - removing from resultset');
  					} else {
	  					location.push(result.items[i].location);
  					}
  				}
  				var urlEncode = encodeURIComponent(location[0].trim());
  				var mapsUrl = 'http://maps.google.com/maps?q=' + urlEncode;
  				response = location[0] + '\n' + 'Google Maps link: ' + mapsUrl;
  				console.log(mapsUrl);
  				cb(error, response);
  			} else {
  				cb(error, 'Sorry, there aint no location info in this calendar event. You should really put location details when your booking appointments.');
  			}
  		}
  	}

	this.eventGetById = function (eventId) {
		console.log('in events' + eventId);
		var filter = {
	  		calendarId:'1@m3m3n70.com', 
	  		eventId: eventId
		}

		gapi.googleapis.execute(
			function (error, result) {
				if (error) console.log(error);
				else {
					var client = result;
					client.calendar.events.get(filter)
					.execute
				  		(function (error, result) {
				  			that.eventResponse(error, result);
						});
				}
	 		}
		);
	}

	this.eventResponse = function (error, result) {
		//console.log('response should be: ' + result);
		var response = 'You have a meeting on ' + moment(result.start.dateTime).format('dddd, MMMM Do YYYY') + ' at ' + 
						moment(result.start.dateTime).format('H:mm') + ': ' + 
						result.summary 
		cb(error, response);
	}

	this.eventQuery = function (from, to, handler, query) {
		this.from = from;
		this.to = to;
		this.handler =
		this.query = query;
		var that = this;

		var filter = {
	  		calendarId:'1@m3m3n70.com', 
	  		singleEvents: true,
	  		orderBy: 'startTime',
	  		showDeleted: false,
	  		maxResults: 10000,
	  		status: 'confirmed',
	  		timeMin: from,
	  		timeMax: to
		}

		gapi.googleapis.execute(
			function (error, result) {
				if (error) console.log(error);
				else {
					var client = result;
					client.calendar.events.list(filter)
					.execute 
				  		(function (error, result) {
				  			handler (error, result, query);
						});
				}
	 		}
		);
	}

	this.eventCount = function (error, result) {
		if (error) console.log(error);
		else {
			var eventCount = result.items.length;
			console.log(eventCount);
			var response = 'You have ' + eventCount + ' scheduled meetings.';
			cb(error, response);
		}
	}

	//need to handle upper /lower case
	this.eventSearch = function (error, result, query) {
		if (error) console.log(error);
		else {
			console.log('QUERY IS: ' + query);
			var my_events = [];
			var my_ids = [];
			for (var i = 0; i < result.items.length; i++) {
				my_events.push(result.items[i].summary);
				my_ids.push(result.items[i].id);
			}

			function searchStringInArray (str, strArray) {
				for (var j = 0; j < strArray.length; j++) {
					if (strArray[j].match(str)) return j;
			    }
			    return null;
			}
			var index = searchStringInArray(query, my_events);
			console.log ('index is: ' + index);
			if (index != null) {
				var eventId = my_ids[index];
				that.eventGetById(eventId);	
			} else {
				cb (error, 'Cant find anything bro.');
			}

		}
	}

	this.eventListNotDeclined = function (error, result) {
	  	if (error) console.log(error);
		else {
			var attendees = [];
	    	for (var i = 0; i <= result.items.length -1; i++) {
	  			if (result.items[i].attendees) {
	  				attendees = result.items[i].attendees;
	  			} else {
	  				attendees = 0;
	  			}

				for (var n = 0; n < attendees.length -1; n++) {
					var email = attendees[n].email;
					var responseStatus = attendees[n].responseStatus;	
					if ((email === '1@m3m3n70.com') && (responseStatus === 'declined')) {
						console.log('declined, not including meeting in response.');
						result.items[i].status = 'declined';
					} 
				}
				var returnStartTime = result.items[i].start;
				var status = result.items[i].status;
	  			var stringStartTime = JSON.stringify(returnStartTime);
	  			var objectStartTime = JSON.parse(stringStartTime);
	  			var startTime = objectStartTime.dateTime;
	  			startTime = moment(startTime).format('H:mm');
	  			my_events[i] = startTime + ': ' + result.items[i].summary;
	    	};
	    	
			function searchStringInArray (str, strArray) {
				for (var j = 0; j < strArray.length; j++) {
					if (strArray[j].match(str)) return j;
			    }
			    return -1;
			}

			var index = searchStringInArray('declined', my_events);
			console.log('index is: ' + index);
			my_events.splice(index, 1);
	    	
	    	for (var i = 0; i < my_events.length; i++) {
	    		my_events[i] = '\n' + my_events[i];
	    	}
	    	if (my_events.length < 5) {
	    		var response = 'Not too busy .. \n' + my_events.join(' ');
				cb(error, response);
			}
			else {
				var response = 'Pretty busy day: \n' + my_events.join(' ');
				cb(error, response);
			}
		}
	}

	if (!access_token) { 
		console.log('we have no access token')
	} else {
		console.log('access token exists');
		switch(calendarType) {
			case 'eventNext':
				var from = moment().format();
				var to = moment().add(24, 'hours').format();
				this.eventQuery(from, to, that.eventNext);
				break; 

			case 'eventList': 
				this.eventQuery(from, to, that.eventListNotDeclined);
				break;

			case 'eventCount':
				this.eventQuery(from, to, that.eventCount);
				break;

			case 'eventRemainingToday': // should be just event remaining + variable
				var from = moment().format();
				var to = moment().add(12, 'hours').format();
				this.eventQuery(from, to, that.eventListNotDeclined);
				break;

			case 'eventLocation':
				var from = moment().format();
				var to = moment().add(24, 'hours').format();
				this.eventQuery(from, to, that.eventLocation);	
				break;

			case 'eventSearch':
				var from = moment().format();
				var to = moment().add(90, 'days').format();
				var contact = entitiesObj.contact.value; console.log(contact);
				this.eventQuery(from, to, that.eventSearch, contact);
				break;

			case 'eventAvailability':				
				break;

			case 'eventActionBook':				
				break;

			case 'eventActionCancel':				
				break;

			case 'eventActionBook':				
				break;

			case 'eventActionDelay':				
				break;

			case 'eventActionMove':				
				break;

			case 'eventActionFollowUp':				
				break;

			case 'eventConfirmation':		
				break;

			default: 
				console.log('sorry, no calendar module for this');
				break;
		}
	}
}

module.exports = Calendar;

