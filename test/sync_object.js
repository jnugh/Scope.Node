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

exports['test SyncObject#test onChange'] = function(beforeExit, assert){
	var callCounter = 0;
	var onChangeId = object.registerOnChange(function(){
		callCounter++;
	});
	object.update({
		newElement: 'new', 
		an: {newElement: 'data'}
	});
	object.unregisterOnChange(onChangeId);
	object.update({
		newElement: 'new', 
		an: {newElement: 'data'}
	});
	assert.eql(callCounter, 1); //First update should have lead to an event, second should have not
};

exports['test SyncObject#test multiple on change'] = function(beforeExit, assert){
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
	assert.eql(callCounter1, 1);
	assert.eql(callCounter2, 2);
};
