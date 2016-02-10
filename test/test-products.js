var exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var testProductName = "MochaTestProduct" + Date.now();
	var testThingName = "MochaTestThing" + Date.now();

	describe('products', function(){

		it('create', function(done) {
			this.timeout(config.TIMEOUT * 2);
			exec('./rapifire-cli products list', function(error, stdout, stderr) {
				stdout.should.not.containEql('\"name\": \"' + testProductName + '\"');
				exec('./rapifire-cli products create ' + testProductName + ' 123456789', function(error, stdout, stderr){
					stdout.should.containEql('New product created');
					stdout.should.containEql('\"name\": \"' + testProductName + '\"');
					stdout.should.containEql('\"heartbeat\": 123456789');
					done();
				});
			});

		});

		it('meta', function(done){
			this.timeout(config.TIMEOUT * 6);
			exec('./rapifire-cli products meta ' + testProductName, function(error, stdout, stderr) {
				stdout.should.containEql('No meta.');
				exec('./rapifire-cli products meta-add ' + testProductName + ' metaKey metaValue', function(error, stdout, stderr) {
					stdout.should.containEql('Metadata added.');
					exec('./rapifire-cli products meta ' + testProductName, function(error, stdout, stderr) {
						stdout.should.containEql('\"key\": \"metaKey\"');
						stdout.should.containEql('\"value\": \"metaValue\"');
						exec('./rapifire-cli products meta-delete ' + testProductName + ' metaKey', function(error, stdout, stderr) {
							stdout.should.containEql('Key metaKey deleted for product ' + testProductName);
							exec('./rapifire-cli products meta ' + testProductName, function(error, stdout, stderr) {
								stdout.should.containEql('No meta.');
								done();
							});
						});
					});
				});
			});
		});

		it('delete with things', function(done){
			this.timeout(config.TIMEOUT * 3);
			exec('./rapifire-cli things create ' + testThingName + ' ' + testProductName, function(error, stdout, stderr){
				stdout.should.containEql('New thing created');
				exec('./rapifire-cli products delete ' + testProductName, function(error, stdout, stderr){
					stdout.should.containEql('Thing already exists');
					exec('./rapifire-cli things delete ' + testThingName, function(error, stdout, stderr){
						stdout.should.containEql('Thing ' + testThingName + ' deleted');
						done();
					});
					
				});
			});
		});

		it('delete', function(done){
			exec('./rapifire-cli products delete ' + testProductName, function(error, stdout, stderr){
				stdout.should.containEql('Product ' + testProductName + ' deleted.');
				done();
			});
		});

	});

});