var assert = require('assert'),
	exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var tools = require('../tools.js');

var TIMEOUT = 10000;

describe('rapifire-cli', function() {

	var auth;
	var testUsername;
	var testPassword = "mochaTestPassword";

	before(function(){
		auth = tools.getAuthObj();
		testUsername = "mochaTestUser" + Date.now();
	});

	describe('users', function() {

		it('create', function(done){
			this.timeout(TIMEOUT * 3);

			exec('./rapifire-cli users list', function(error, stdout, stderr){
				stdout.should.not.containEql(testUsername);
					exec('./rapifire-cli users create ' + testUsername + ' ' + testPassword + ' MochaTestUser', function(error, stdout, stderr){
						stdout.should.containEql('User MochaTestUser created.');
						exec('./rapifire-cli users list', function(error, stdout, stderr){
							stdout.should.containEql(testUsername);
							done();
						});
				});
			});

		});


		it('delete', function(done){
			this.timeout(TIMEOUT * 2);

			exec('./rapifire-cli users show ' + testUsername, function(error, stdout, stderr) {
				stdout.should.containEql('\"username\": \"' + testUsername + '\"');
				exec('./rapifire-cli users delete ' + testUsername, function(error, stdout, stderr){
					stdout.should.containEql('User ' + testUsername + ' deleted.');
					done();
				});
			});

		});

	});

});