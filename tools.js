var fs = require("fs");
var path = require("path");
var WebSocket = require('ws');
var rest = require('restler');
var config = require('./config');

module.exports = {
    urlLogin: function() {
        return config.baseWebUrl + '/myself';
    },
    urlRegister: function() {
        return config.baseWebUrl + '/developers';
    },
    urlActivate: function(token) {
        return config.baseWebUrl + '/developers?token=' + token;
    },
    urlCloudCode: function(productId) {
        return config.baseApiUrl + "/code/" + productId;
    },
    urlProductByName: function(name) {
        return config.baseApiUrl + "/products/?name=" + encodeURIComponent(name);
    },
    urlUserByName: function(name) {
        return config.baseApiUrl + "/users/?username=" + encodeURIComponent(name);
    },
    urlThingByName: function(name) {
        return config.baseApiUrl + "/things/?thingName=" + encodeURIComponent(name);
    },

  getProfileFilename: function() {
    return (process.env.HOME || process.env.USERPROFILE) + path.sep + ".rapifire-cli";
  },
  readConfig: function() {
    var buf = fs.readFileSync(this.getProfileFilename());
    return JSON.parse(buf);
  },
  writeConfig: function(obj) {
    fs.writeFileSync(this.getProfileFilename(), JSON.stringify(obj));
  },
  failureHandler: function(data, response) {
    console.log("REST call failed. Status code:", response.statusCode, "Body:", data);
  },
  printJson: function(json) {
    // last parameter is number of spaces
    console.log(JSON.stringify(json, null, 4));
  },
  printJsonArray: function(jsonArray) {
    for (var key in jsonArray) {
      this.printJson(jsonArray[key]);
    }
  },
  getAuthObj: function() {
    var config = this.readConfig();
    return {
      username: config.username,
      password: config.password
    };
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
      console.log(data);
    });

    ws.on('close', function close() {
      process.exit(0);
      ws = null;
    });

    ws.on('open', function() {
      ws.send(JSON.stringify(init));
      ws.send(JSON.stringify(packet));
    });
  },
  doForProductName: function(productName, callback) {
    rest.get(urlProductByName(productName), this.getAuthObj())
      .on('success', function(data, response) {
        if (data.length != 1) {
          console.log("Found " + data.length + " products. Expected single product.");
          process.exit(1);
        }
        var productId = data[0].id;
        callback(productId);
      }).on('fail', this.failureHandler);
  },
  doForUserName: function(username, callback) {
    rest.get(urlUserByName(username), this.getAuthObj())
      .on('success', function(data, response) {
        if (data.length != 1) {
          console.log("Found " + data.length + " users. Expected single user.");
          process.exit(1);
        }
        var userId = data[0].id;
        callback(userId);
      }).on('fail', this.failureHandler);
  },
  doForThingName: function(thingName, callback) {
    rest.get(urlThingByName(thingName), this.getAuthObj())
      .on('success', function(data, response) {
        if (data.length != 1) {
          console.log("Found " + data.length + " things. Expected single thing.");
          process.exit(1);
        }
        var thingId = data[0].thingId;
        callback(thingId);
      })
      .on('fail', this.failureHandler);
  }
}
