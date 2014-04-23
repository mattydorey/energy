var redis = require('redis');
var dbConnection = redis.createClient();
var S = require('string');
var Module = require('../src/module');

var Data = (function() {

	var instance;
	var that = init.this;

	function init() {
		console.log('\n<<<<<< ENTERTING DATA >>>>>>');
		
		return {

			phoneNumber: null,
			//that: this,

			getNextId: function(key, cb) {
				this.key = key;
				this.cb = cb;

				next_id = 'next_' + key + '_id';
				
				dbConnection.incr(next_id, function (error, result) {
					if (error) console.log('Error: ' + error);
					else { 
						console.log('Next ID: ' + result);
						cb(null, result);
					}
				});
			},

			insertRecord: function (id, key, field, data) {	
					dbConnection.hset(key + ':' + id, field, data, function(error, result) {
						if (error) console.log('Error: ' + error); 
						else console.log('Record Inserted: ' + key + ':' + id + ' ' + field + ': ' + data);
					});
			},
			
			insertMember: function (id, key, field, data) {
						dbConnection.sadd(data, key + ':' + id, function(error, result) {
						if (error) console.log('Error: ' + error); 
						else console.log('SAdd Inserted: ' + data + ' in ' + key + ':' + id);
					});
			},

			getRecord: function (key, field, cb) {
				dbConnection.hget(key, field, function (error, result) {
					cb(null, result);
				});
			},

			getMember: function (query, cb) {
				dbConnection.smembers(query, function (error, result) {
					cb(null, result);
				});
			},

			getKey: function (intent, cb) {
				dbConnection.smembers(intent, function (error, result) {
					var key = JSON.stringify(result);
					key = key.substr(2, key.length-4);
					cb(null, result);
				});
			},

			getModule: function (module, params, entities, token, cb) {
				var mod = new Module();
				mod.selectModule(module, params, entities, token, function (error, result) {
					if (error) console.log(error);
					else {
						cb(null, result);	
					}
				});
			},

			findRecipe: function (intent, entities, phoneNumber, cb) {
				this.intent = intent; 
				this.entities =  entities;
				this.phoneNumber = phoneNumber;
				var params;
				var module;
				var recipe;
				var access_token;
				var key;
				var that = this;
				this.getKey(intent, function (error, result) {
					key = result;
					console.log('Key is: ' + key);
					that.getRecord(key, 'name', function (error, result) {
						that.getRecord(key, 'params', function (error, result) {
							params = result;
							that.getRecord(key, 'module', function (error, result) {
								module = result;
								that.getMember(phoneNumber, function (error, result) {
									that.getRecord(result, 'access_token', function (error, result) {
										access_token = result;
										that.getModule(module, params, entities, access_token, function (error, result) {
											cb(null, result);
										});										
									});
								});
							});
						});
					});
				});
			},	 

			insertMessage: function (phoneNumber, message) {
				this.phoneNumber = phoneNumber;
				var dateTime;
				this.getDateTime(function (error, result) {
					dateTime = result;
					instance.getNextId('message', function(error, id) {
						instance.insertRecord(id, 'message', 'dateTime', dateTime);
		    			instance.insertRecord(id, 'message', 'phoneNumber', phoneNumber);
		    			instance.insertRecord(id, 'message', 'message', message);
					});
				});
			},

			storeToken: function (token, phoneNumber) { 
		  		var tokenString = JSON.stringify(token);
		  		var tokenJSON = JSON.parse(tokenString);

		  		var access_token = tokenJSON.access_token;
		  		var token_type = tokenJSON.token_type;
		  		var expires_in = tokenJSON.expires_in;
		  		var id_token = tokenJSON.id_token;
		  		var refresh_token = tokenJSON.refresh_token;

				console.log(access_token);
		  		console.log(refresh_token);

		  		//TODO: clean up key/id and phoneNumber passing
		  		this.insertRecord('1', 'gapi', 'name', phoneNumber);
		  		this.insertRecord('1', 'gapi', 'access_token', access_token);
		  		this.insertRecord('1', 'gapi', 'token_type', token_type);
		  		this.insertRecord('1', 'gapi', 'expires_in', expires_in);
		  		this.insertRecord('1', 'gapi', 'id_token', id_token);
		  		this.insertRecord('1', 'gapi', 'refresh_token', refresh_token);
		  		this.insertMember('1', 'gapi', 'name', phoneNumber);
  			},

			getDateTime: function (cb) {
				var now = new Date();
				var dateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
				function AddZero (num) { 
					return (num >= 0 && num < 10) ? "0" + num : num + "";
				}
				cb(null, dateTime);
			}
		};
	};
	
	return {
		getInstance: function() {
			if (!instance) {
				instance = init();
			}
			return instance;
		}
	};
})();

module.exports = Data;








