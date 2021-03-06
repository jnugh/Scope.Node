var srcPath = process.env.ANGULAR_NODE_COVERAGE?'../src-cov':'../src';

var SyncObject = require(srcPath + '/sync_object.js');
var assert = require("assert");

describe('SyncObject', function(){
	
	var data = {
	    	my: 'test',
	    	data: 'contains',
	    	an: {data: 'array'}
	};
	
	var object = new SyncObject(data);

	describe('#get()', function(){
		it('should return "test"', function(){
			assert.equal(object.get('my'), 'test');
		});
		it('should return all values', function(){
			assert.equal(object.get(), data);
		});
		it('should return "arrray"', function(){
			assert.equal(object.get('an.data'), 'array');
		});
		it('should get undefined', function(){
			assert.strictEqual(object.get('undefined', undefined));
		});
	});
	
	describe('#update()', function(){
		object.update({
			newElement: 'new', 
			an: {newElement: 'data'}
		});
		it('should return "new"', function(){
			assert.equal(object.get('newElement'), 'new');
		});
		it('should return the merged object', function(){
			assert.deepEqual(object.get('an'), {data: 'array', newElement: 'data'});
		});
	});
	
	describe('#registerOnChange()', function(){
		var callCounter1 = 0;
		var callCounter2 = 0;
		var onChangeId1 = object.registerOnChange(function(){
			callCounter1++;
		});
		var onChangeId2 = object.registerOnChange(function(){
			callCounter2++;
		});
		object.update({
			newElement: 'new', 
			an: {newElement: 'data'}
		});
		object.unregisterOnChange(onChangeId1);
		object.update({
			newElement: 'new', 
			an: {newElement: 'data'}
		});
		it('should have been called one time / two times', function(){
			assert.equal(callCounter1, 1);
			assert.equal(callCounter2, 2);
		});
	});
	
	describe('#unset()', function(){
		it('should not have a property "notThere"', function(){
			assert.equal(object.get().hasOwnProperty('notThere'), false);
		});
		it('should have a property "notThere" which will then be deleted', function(){
			object.update({notThere: true});
			assert.equal(object.get().hasOwnProperty('notThere'), true);
			object.unset('notThere');
			assert.equal(object.get().hasOwnProperty('notThere'), false);
		});
	});
	
	describe('#isEmpty()', function(){
		var emptyStore;
		beforeEach(function(done){
			emptyStore = new SyncObject();
			done();
		});
		it('should be empty', function(){
			assert.equal(emptyStore.isEmpty(), true);
		});
		it('should be empty', function(){
			assert.equal(emptyStore.isEmpty(), true);
		});
		it('should not be empty', function(){
			emptyStore.update({'notEmpty': true});
			assert.equal(emptyStore.isEmpty(), false);
		});
		it('should be empty', function(){
			emptyStore.update({'notEmpty': true});
			emptyStore.unset('notEmpty');
			assert.equal(emptyStore.isEmpty(), true);
		});
		it('should be empty', function(){
			emptyStore.update({'notEmpty': true});
			emptyStore.update({'notEmpty': undefined});
			assert.equal(emptyStore.isEmpty(), true);
		});
	});
});
