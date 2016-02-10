// use authentication from local configuration
var tools = require('../tools.js');
var config = require('../config.js');

console.log("Test env configuration:");
console.log("Base API Url: " + config.baseApiUrl);
console.log("Base WEB Url: " + config.baseWebUrl);


module.exports = {
	TIMEOUT: 10000,
	auth: function(){
		var auth = null;
		try {
		  auth = tools.getAuthObj();
		} catch(e) {
			throw 'Error reading authorization data: ' + e.message;
		} 

		return auth;
	}
}

console.log('Account: ' + module.exports.auth().username);