

function Greeting () {
	
	this.returnGreeting = function (cb) {
		var responses = new Array(
			'Yo',
			'Hej!',
			'Salut',
			'Hallo!',
			'Hey',
			'Ola amigo',
			'Konnichiwa!',
			'Sup bra',
			'What up?',
			'Hows it going?',
			'Whats shakin?',
			'Whats going onnnnn?',
			'Whats happening?',
			'Anything new?',
			'Anything new with you?',
			'Sup?',
			'What are you up to?',
			'whats poppin',
			'Whatd you do today?' ,
			'where you been',
			'how ya doin?',
			'ayo',
			'wasup',
			'Whassup',
			'Whatcha doin?',
			'Wazzapening??!!!?!?!?',
			'How are you?');
		var response = responses[Math.floor(Math.random()*responses.length)]; 
		setTimeout(cb(null, response), 5);
	}
}

module.exports = Greeting;