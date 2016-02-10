var exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var auth = config.auth();
	var testThingName = "MochaTestThing" + Date.now();
	var testProductName = "MochaTestProduct" + Date.now()
	var testThingCloneName = "MochaThingClone" + Date.now();

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

		it('make-public', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things make-public ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Thing data is now public.');
				done();
			});
		});

		it('clone', function(done) {
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things clone ' + testThingName + ' ' + testProductName + ' ' + testThingCloneName, function(error, stdout, stderr){
				stdout.should.containEql('Clone success');
				stdout.should.containEql('\"name\": \"' + testThingCloneName + '\"');
				stdout.should.containEql('\"clone\": true');
				done();
			})
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
		this.timeout(config.TIMEOUT * 2);
		exec('./rapifire-cli things delete ' + testThingCloneName, function(error, stdout, stderr) {
			stdout.should.containEql('Thing ' + testThingCloneName + ' deleted');
			exec('./rapifire-cli products delete ' + testProductName, function(error, stdout, stderr){
			stdout.should.containEql('Product ' + testProductName + ' deleted');
			done();
		});
	});

		
	});

});