var fs = require("fs");
var path = require("path");
var WebSocket = require('ws');
var rest = require('restler');
var config = require('./config');

var getProductByNameUrl = config.baseApiUrl + "/products/?name=";
var getUserByNameUrl = config.baseApiUrl + "/users/?username=";
var getThingByNameUrl = config.baseApiUrl + "/things/"

module.exports = {
	getProfileFilename : function() {
	  return (process.env.HOME || process.env.USERPROFILE) + path.sep + ".rapifire-cli";
	},
	readConfig : function() {
	  var buf = fs.readFileSync(this.getProfileFilename());
	  return JSON.parse(buf);
	},
	writeConfig : function(obj) {
	  fs.writeFileSync(this.getProfileFilename(), JSON.stringify(obj));
	},
	failureHandler : function(data, response) {
	  console.log("REST call failed. Status code:", response.statusCode, "Body:", data);
	},
	printJson : function(json){
		// last parameter is number of spaces
		console.log(JSON.stringify(json, null, 4));
	},
	printJsonArray : function(jsonArray) {
		for(var key in jsonArray) {
			this.printJson(jsonArray[key]);
		}
	},
	getAuthObj : function() {
		var config = this.readConfig();
		return {username: config.username, password: config.password};
	},
    subscribe: function(authId, authKey, channel, url) {
        var init = {
            "operation": "init",
            "data": {
                "authId": authId,
                "authKey": authKey,
            }
        };

        var packet = {
            "operation": "subscribe",
            "data": {
                "channel": channel
            }
        };

        var ws = new WebSocket(url);

        ws.on('message', function(data) {
            console.log("<- " + data);
        });

        ws.on('close', function close() {
            process.exit(0);
            ws = null;
        });

        ws.on('open', function() {
            console.log("-> " + JSON.stringify(init));
            ws.send(JSON.stringify(init));

            console.log("-> " + JSON.stringify(packet));
            ws.send(JSON.stringify(packet));
        });
    },
    doForProductName: function(productName, callback) {
	  rest.get(getProductByNameUrl + productName, this.getAuthObj())
	      .on('success', function(data, response) {
	        if(data.length != 1){
	          process.exit(1);
	        }
	        var productId = data[0].id;
	        callback(productId);
	      }).on('fail', this.failureHandler);
	},
	doForUserName: function(username, callback) {
	  rest.get(getUserByNameUrl + username, this.getAuthObj())
	    .on('success', function(data, response) {
	      if(data.length != 1){
	        process.exit(1);
	      }
	      var userId = data[0].id;
	      callback(userId);
	    }).on('fail', this.failureHandler);
	},
	doForThingName: function(thingName, productName, callback) {
	  var auth = this.getAuthObj();
	  var failureHandler = this.failureHandler
	  this.doForProductName(productName, function(productId) {
	    rest.get(getThingByNameUrl + "?productId=" + productId + "&thingName=" + thingName, auth)
	      .on('success', function(data, response){
	        if(data.length != 1){
	          process.exit(1);
	        }
	        var thingId = data[0].thingId;
	        callback(thingId, productId);
	      })
	      .on('fail', failureHandler);
	  });
	}
}
