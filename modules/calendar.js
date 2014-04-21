var Gapi = require('./gapis');
var datetime = require('./datetime');

function Calendar(access_token, entities, cb) {
	var gapi = new Gapi(access_token);
	this.cb = cb;
	entitiesString = JSON.stringify(entities);
	entitiesObj = JSON.parse(entitiesString);
	var when = entitiesObj.when.value;

	var timeMin = datetime.today();
	var timeMax = datetime.getDate(when);

	this.getEvents = function () {
		gapi.googleapis
			.discover('calendar', 'v3')
			.discover('oauth2', 'v2')
			.execute(
				function (error, result) {
					if (error) console.log(error);
					else {
						var client = result;
						client.calendar.events.list({
					  		calendarId:'1@m3m3n70.com', 
					  		singleEvents: true,
					  		orderBy: 'startTime',
					  		showDeleted: false,
					  		timeMin: timeMin,
					  		timeMax: timeMax
					  		})
						.withAuthClient(gapi.oauth2Client)
						.execute 
					  		(function (error, result) {
					  			if (error) console.log(error);
					  			else {
					  				var eventCount = result.items.length;
					  				console.log(eventCount);
					  				cb(error, eventCount);
					  			}
							  //   	for (var i = result.items.length - 1; i >= 0; i--) {
							  // 			my_events.push(result.items[i].summary);
							  //   	};
							  //   	var eventsString = JSON.stringify(my_events);
									// var eventsJSON = JSON.parse(eventsString);
									// console.log(my_events);
							});
					}
		 		}
		);
	}

	if (!access_token) { 
		console.log('we have no access token')
	} else {
		console.log('access token exists');
		this.getEvents();
	}
}

module.exports = Calendar;








