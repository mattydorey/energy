var request = require('request');
var cheerio = require('cheerio');

function Scraper(url,  div) {
	console.log('\n<<<<<< ENTERTING SCRAPER >>>>>>');
	this.url = url;
	this.div = div;

	this.newScrape = function (url, div, cb) {
		this.url = url;
		this.div = div;
		this.cb = cb;
		
		request(url, function (error, response, body) {
	 		if (error) {
	 			console.log('error');
	 			cb(error);
	 		} else {
	    		$ = cheerio.load(body);
	    		div = $(div);
	    		divContent = div.text();
	    		var firstDiv = divContent.split('.');
				cb(null, firstDiv[0]);
	    		// If we want to get all divs 
	    		// $(div).each(function() {
	    		// 	divContent = $(this).text();
	    		// });
				//console.log('getting result');
	 		}
		});	
	}
}

module.exports = Scraper;