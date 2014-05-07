var SyncObject = require('../src/sync_object.js');

var data = {
    	my: 'test',
    	data: 'contains',
    	an: {data: 'array'}
};
var object = new SyncObject(data);

exports['test SyncObject#create'] = function(beforeExit, assert){
	assert.eql(object.get('my'), 'test');
	assert.eql(object.get(), data);
};

exports['test SyncObject#update'] = function(beforeExit, assert){
	object.update({
		newElement: 'new', 
		an: {newElement: 'data'}
	});
	assert.eql(object.get('newElement'), 'new');
	assert.eql(object.get('an'), {data: 'array', newElement: 'data'});
};

exports['test SyncObject#get deep'] = function(beforeExit, assert){
	assert.eql(object.get('newElement'), 'new');
	assert.eql(object.get('an.newElement'), 'data');
};
