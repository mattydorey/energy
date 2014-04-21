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
				var token;
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
									that.getRecord(result, 'token', function (error, result) {
										token = result;
										that.getModule(module, params, entities, token, function (error, result) {
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








