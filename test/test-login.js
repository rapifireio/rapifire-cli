var assert = require('assert'),
	exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var config = require('./test-config.js');

describe('rapifire-cli', function() {

	var auth;

	before(function(){
		auth = config.auth();
	});

  describe('help', function() {

  	it('test printing help', function(done){
  		exec('./rapifire-cli -h', function(error, stdout, stderr){
  			stdout.should.containEql("Usage: rapifire-cli [options] [command]");
  			done();
  		});
  	});

  });
  
  describe('login', function () {

    it('success', function (done) {
    	this.timeout(config.TIMEOUT);
      exec('./rapifire-cli login ' + auth.username + ' ' + auth.password, function(error, stdout, stderr){
      	stdout.should.containEql('Logged in.');
      	done();
      });
    });

    it('failure', function(done){
    	this.timeout(config.TIMEOUT);
    	exec('./rapifire-cli login ' + auth.username + '_not_know' + ' ' + auth.password + "_bad_pass", function(error, stdout, stderr){
      	stdout.should.containEql('Bad credentials');
      	done();
      });
    });

  });

});