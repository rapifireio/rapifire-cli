var assert = require('assert'),
	exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var auth = config.auth();
	var testThingName = "MochaTestThing" + Date.now();
	var testProductName = "MochaTestProduct" + Date.now()

	before(function(done){
		this.timeout(config.TIMEOUT);
		exec('./rapifire-cli products create ' + testProductName, function(error, stdout, stderr){
			stdout.should.containEql('New product created');
			done();
		});
	});


	describe('things', function(){

		it('create', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things show ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Thing not found.');
				exec('./rapifire-cli things create ' + testThingName + ' ' + testProductName, function(error, stdout, stderr){
					stdout.should.containEql('New thing created');
					stdout.should.containEql('\"name\": \"' + testThingName + '\"');
					done();
				});
			});
		});

		it('delete', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things delete ' + testThingName, function(error, stdout, stderr) {
				stdout.should.containEql('Thing ' + testThingName + ' deleted');
				done();
			});
		});


	});

	after(function(done){
		this.timeout(config.TIMEOUT);
		exec('./rapifire-cli products delete ' + testProductName, function(error, stdout, stderr){
			stdout.should.containEql('Product ' + testProductName + ' deleted');
			done();
		});
	});

});