var moment = require('moment');

function DateTime () {
	var datetime;
	
	this.today = function () {
		var today = moment().format('YYYY-MM-DDThh:mm:ss'+'Z'); console.log('Today is: ' + today);
		return today;
	}
	
	this.getDate = function (when) {
		switch(when) {
			case 'yesterday':
				datetime = moment().add('days', -1).format(); console.log('Yesterday was: ' + datetime);
				return datetime;

			case 'tomorrow':
				datetime = moment().add('days', 1).format(); console.log('Tomorrow is: ' + datetime);
				return datetime;
			
			case 'lastWeek':
				datetime = moment().add('days', -7).format(); console.log('Last week is: ' + datetime);
				return datetime;

			case 'nextWeek':
				datetime = moment().add('days', 7).format(); console.log('Next week is: ' + datetime);
				return datetime;			
			
			case 'lastMonth':
				datetime = moment().add('months', -1).format(); console.log('Last month is: ' + datetime);
				return datetime;

			case 'nextMonth':
				nextMonth = moment().add('months', 1).format(); console.log('Next month is: ' + datetime);
				return datetime;
		}
	}
}

module.exports = new DateTime;