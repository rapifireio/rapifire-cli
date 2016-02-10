var assert = require('assert'),
	exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var auth;
	var testUsername;
	var testPassword = "mochaTestPassword";

	before(function(){
		auth = config.auth();
		testUsername = "mochaTestUser" + Date.now();
	});

	describe('users', function() {

		it('create', function(done){
			this.timeout(config.TIMEOUT * 3);

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

		it('update', function(done) {
			this.timeout(config.TIMEOUT * 2);

			exec('./rapifire-cli users update ' + testUsername + ' MochaTestUserNameUpdated DescriptionUpdated ', function(error, stdout, stderr) {
				stdout.should.containEql('User MochaTestUserNameUpdated updated.');
				exec('./rapifire-cli users show ' + testUsername, function(error, stdout, stderr){
					stdout.should.containEql('\"description\": \"DescriptionUpdated\"');
					done();
				});
			});
		});


		it('meta', function(done) {
			this.timeout(config.TIMEOUT * 5);

			exec('./rapifire-cli users meta-show ' + testUsername + ' mochaTestKey', function(error, stdout, stderr){
				stdout.should.containEql('REST call failed');
				exec('./rapifire-cli users meta-add ' + testUsername + ' mochaTestKey mochaTestValue', function(error, stdout, stderr){
					stdout.should.containEql('Metadata added.');
					exec('./rapifire-cli users meta-show ' + testUsername + ' mochaTestKey', function(error, stdout, stderr){
						stdout.should.containEql('\"key\": \"mochaTestKey\"');
						stdout.should.containEql('\"value\": \"mochaTestValue\"');
						exec('./rapifire-cli users meta-delete ' + testUsername + ' mochaTestKey', function(error,stdout,stderr){
							stdout.should.containEql('Metadata deleted.');
							exec('./rapifire-cli users meta-show ' + testUsername + ' mochaTestKey', function(error, stdout, stderr){
								stdout.should.containEql('REST call failed');
								done();
							});
						});
					});
				});
			});
		});


		it('delete', function(done){
			this.timeout(config.TIMEOUT * 2);

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