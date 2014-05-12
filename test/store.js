var srcPath = process.env.ANGULAR_NODE_COVERAGE?'../src-cov':'../src';

var Store = require(srcPath + '/store.js');
var assert = require("assert");
var Buffer = require('buffer').Buffer;
var SyncObject = require(srcPath + '/sync_object.js');

describe('Buffer', function(){
	describe('#randomize()', function(){
		var buffer = new Buffer(100);
		it('should produce random results', function(){
			buffer.randomize();
			var result = buffer.toString('base64');
			buffer.randomize();
			assert.notEqual(result, buffer.toString('base64'));
		});
	});
});

describe('Store', function(){
	var object = new SyncObject({'this': 'is', 'a': {'big': 'test'}});
	var store = new Store();
	describe('#getUnusedHandlerId()', function(){
		it('should never produce similar results', function(){
			var result = store.getUnusedHandlerId();
			assert.notEqual(result, store.getUnusedHandlerId());
		});
	});
	
	describe('#store()', function(){
		store.store('test', object);
		it('should contain the same sync object', function(){
			assert.deepEqual(store.get('test'), object);
		});
	});
	
	describe('#get()', function(){
		it('should contain the sync object', function(){
			assert.deepEqual(store.get('test'), object);
		});
		var emptyStore = store.get('empty');
		it('should generate an empty store', function(){
			assert.equal(emptyStore.isEmpty(), true);
		});
	});
	
	describe('#serialize()', function(){
		
		var result = store.serialize('test');
		var resultObj = JSON.parse(result);
		it('should contain an handler key', function(){
			assert.notEqual(typeof(resultObj.handlerKey), 'undefined');
			assert.deepEqual(resultObj.a, {'big': 'test'});
		});
		
	});
	
	describe('#connect()', function(){
		var result = store.serialize('test');
		var resultObj = JSON.parse(result);
		it('should throw an exception if the listener does not exist', function(){
			assert.throws(function(){
				store.connect('not existing', function(){})
			}, Error);
		});
		it('should connect to the change listener', function(done){
			store.connect(resultObj.handlerKey, function(data){
				assert.equal(data.should, 'call');
				done();
			});
			object.update({should: 'call'});
		});
		it('should not connect to the change listener a second time', function(){
			assert.throws(function(){
				store.connect(resultObj.handlerKey, function(data){
					assert.fail('has been registered!');
					done();
				});
			}, Error);
		});
	});
	
	describe('#disconnect()', function(){
		var result = store.serialize('test2');
		var resultObj = JSON.parse(result);
		var object = store.get('test2');
		
		it('should disconnect the listener', function(done){
			store.connect(resultObj.handlerKey, function(data){
				assert.fail('The listener has been called!');
				done();
			});
			store.disconnect(resultObj.handlerKey);
			object.update({should: 'call'});
			done();
		});
		
		it('should throw an exception', function(){
			assert.throws(function(){
				store.disconnect(resultObj.handlerKey);
			}, Error);
			assert.throws(function(){
				store.disconnect('does not exist!');
			}, Error);
		});
	});
});
