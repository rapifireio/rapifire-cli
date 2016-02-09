var assert = require('assert'),
	exec = require('child_process').exec,
	should = require('should');
// use authentication from local configuration
var tools = require('../tools.js');

var TIMEOUT = 10000;


describe('rapifire-cli', function() {

	var auth;

	before(function(){
		auth = tools.getAuthObj();
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
    	this.timeout(TIMEOUT);
      exec('./rapifire-cli login ' + auth.username + ' ' + auth.password, function(error, stdout, stderr){
      	stdout.should.containEql('Logged in.');
      	done();
      });
    });

    it('failure', function(done){
    	this.timeout(TIMEOUT);
    	exec('./rapifire-cli login ' + auth.username + '_not_know' + ' ' + auth.password + "_bad_pass", function(error, stdout, stderr){
      	stdout.should.containEql('Bad credentials');
      	done();
      });
    });

  });

});