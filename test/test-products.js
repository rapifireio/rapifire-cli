var assert = require('assert'),
	exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var testProductName = "MochaTestProduct" + Date.now();

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

		it('delete', function(done){
			exec('./rapifire-cli products delete ' + testProductName, function(error, stdout, stderr){
				stdout.should.containEql('Product ' + testProductName + ' deleted.');
				done();
			});
		});

		it('', )

	});

});