var accountSid = 'AC705e42b0f48c9dc4aa055dd830a816ad';
var authToken = "dfec68a266acd8126f76127c86e30364";
//var client = require('twilio')(accountSid, authToken);
var express = require('express');
var app = express();
var wit = require('./wit');
var http = require('http');
var qs = require('querystring');
var Data = require('../src/data'); 

function Message () {
    var that = this; 
    var db = Data.getInstance({});

    this.messagePost = function (req, res) {
        var body = '';
        req.setEncoding('utf8');
        
        req.on('data', function(data) {
            body += data;
        });

        req.on('end', function() {
            var data = qs.parse(body);
            var jsonString = JSON.stringify(data);
            var jsonDataObject = JSON.parse(jsonString);
            var phoneNumber = jsonDataObject.From;
            var messageResponse = jsonDataObject.Body;
            that.witRequest(req, res, phoneNumber, messageResponse);
            db.insertMessage(phoneNumber, messageResponse);
        });
    }

    this.witRequest = function (req, res, phoneNumber, messageResponse) {
        var queryObject = messageResponse;
        var wit_request = wit.request_wit(queryObject);

        wit_request.when(function (error, result) {
            if (error) console.log(err); // handle error here
            console.log(JSON.stringify(result));
            var jsonString = JSON.stringify(result);
            var jsonDataObject = JSON.parse(jsonString);
            var msgBody = jsonDataObject.msg_body;
            var intent = jsonDataObject.outcome.intent;
            var entities = jsonDataObject.outcome.entities;
            var confidence =  jsonDataObject.outcome.confidence;
            console.log(entities);
            console.log(confidence);    
            that.messageResponse(req, res, phoneNumber, confidence, intent, entities); 
        });
    }

    this.messageResponse = function (req, res, phoneNumber, confidence, intent, entities) {
        res.type('text/xml');
        console.log('confidence is: ' + confidence)
        if(confidence > 0.25) { 
            db.findRecipe(intent, entities, phoneNumber, function (error, result) {
                if(result === null){
                    this.sendMessage(req, res, 'I dont have a module to handle this yet. Do you want to add one? ', result);
                } else {
                    this.sendMessage(req, res, '', result);
                }
            });
        } else {
            var response = '<Response><Message>Sorry bra, confidence is low on this one... ' + (confidence*100) + '%</Message></Response>';
            var smsResponse = res.send(response);
        }
    }
    sendMessage = function (req, res, sentence, result) {
        var response = '<Response><Message>' + sentence + result + '</Message></Response>';
        var smsResponse = res.send(response);
    }
    
    // create send recurring message
}

module.exports = Message;