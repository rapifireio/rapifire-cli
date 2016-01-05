var fs = require("fs");
var path = require("path");

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
	}
}