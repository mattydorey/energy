var Scraper = require('../modules/scraper');
var Greeting = require('../modules/greeting');
var Email = require('../modules/email');
var Calendar = require('../modules/calendar');

function Module() {
	
	this.selectModule = function(module, params, entities, token, cb) {
		console.log('Entering module: ' + module);
		switch(module) {
			case 'Scraper':
				var scrape = new Scraper();
				var paramsObject = JSON.parse(params);
				var url = paramsObject.Url;
				var div = paramsObject.Div;
				
				var entitiesString = JSON.stringify(entities);
				var entitiesObject = JSON.parse(entitiesString);
				var value = null;
				if ('entitiesObject.where.value' in entitiesObject) {
	                var value = entitiesObject.where.value;
	            }

				var urlEntity = url.concat(value).replace(/ /g,"_");

				console.log('Location: ' + value);
				console.log('Url is: ' + urlEntity);
				console.log('Div is: ' + div);
				
				scrape.newScrape(urlEntity, div, function (error, result) {
					if (error) console.log(error);
					else {
						cb(null, result);
					}
				});
				break;

			case 'Greeting':
				var greet = new Greeting;
				greet.returnGreeting(function (error, result) {
					console.log(result);
					cb(null, result);
				});
				break;

			case 'Email':
				var email = new Email('contact', 'message');
				email.sendEmail(function (error, result) {
					console.log(result);
					var response = 'Nice. Email has been.'
					cb(null, response);
				});	
				break;

			case 'Calendar':
				var calendar = new Calendar(token);
				// calendar.listEvents(token, '1@m3m3n70.com', entities, 'nextWeek', function (error, result) {
				// 	console.log(result);
				// });
				// Calendar.existingToken('+14153172907', function (error, result) { 
				// 	Calendar.listEvents(token, '1@m3m3n70.com', '', '', function (error, result) {
				// 		console.log('got results from db and existing token: ' + result);
				// 		cb(null, result);
				// 	});
				// });
				break;

			default: 
				var result = null;
				cb(null, result);
				break;
		}
	}
}

module.exports = Module;