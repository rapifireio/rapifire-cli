var exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var auth = config.auth();
	var testThingName = "MochaTestThing" + Date.now();
	var testPublicThingName = "MochaPTestThing" + Date.now();
	var testPublicMetadataThingName = "MochaMTestThing" + Date.now();
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
					stdout.should.containEql('\"publicData\": false');
					stdout.should.containEql('\"publicMetadata\": false');
					done();
				});
			});
		});

		it('create-public', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things show ' + testPublicThingName, function(error, stdout, stderr){
				stdout.should.containEql('Thing not found.');
				exec('./rapifire-cli things create -p ' + testPublicThingName + ' ' + testProductName, function(error, stdout, stderr){
					stdout.should.containEql('New thing created');
					stdout.should.containEql('\"name\": \"' + testPublicThingName + '\"');
					stdout.should.containEql('\"publicData\": true');
					stdout.should.containEql('\"publicMetadata\": false');
					done();
				});
			});
		});

		it('create-public-metadata', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things show ' + testPublicMetadataThingName, function(error, stdout, stderr){
				stdout.should.containEql('Thing not found.');
				exec('./rapifire-cli things create -m ' + testPublicMetadataThingName + ' ' + testProductName, function(error, stdout, stderr){
					stdout.should.containEql('New thing created');
					stdout.should.containEql('\"name\": \"' + testPublicMetadataThingName + '\"');
					stdout.should.containEql('\"publicData\": true');
					stdout.should.containEql('\"publicMetadata\": true');
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

		it('make-public-again', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things make-public ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Data already public for ' + testThingName + '');
				done();
			});
		});

		it('make-private', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things make-private ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Thing data is now private.');
				done();
			});
		});

		it('make-private-again', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things make-private ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Data already private for ' + testThingName + '.');
				done();
			});
		});

		it('make-public-metadata', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things make-public-metadata ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Thing data and metadata are now public.');
				done();
			});
		});

		it('make-public-metadata-again', function(done){
			this.timeout(config.TIMEOUT);
			exec('./rapifire-cli things make-public-metadata ' + testThingName, function(error, stdout, stderr){
				stdout.should.containEql('Data and metadata already public for ' + testThingName + '.');
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
		exec('./rapifire-cli things delete ' + testPublicThingName, function(error, stdout, stderr) {
			stdout.should.containEql('Thing ' + testPublicThingName + ' deleted');
			exec('./rapifire-cli things delete ' + testPublicMetadataThingName, function(error, stdout, stderr) {
				stdout.should.containEql('Thing ' + testPublicMetadataThingName + ' deleted')
				exec('./rapifire-cli things delete ' + testThingCloneName, function(error, stdout, stderr) {
					stdout.should.containEql('Thing ' + testThingCloneName + ' deleted')
					exec('./rapifire-cli products delete ' + testProductName, function(error, stdout, stderr){
						stdout.should.containEql('Product ' + testProductName + ' deleted')
					});
					done();
				});
			});
		});
	});

});