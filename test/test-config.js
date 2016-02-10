// use authentication from local configuration
var tools = require('../tools.js');

module.exports = {
	TIMEOUT: 10000,
	auth: function(){
		return tools.getAuthObj();
	}
}