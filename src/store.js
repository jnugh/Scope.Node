
var fs = require('fs');
var Buffer = require('buffer').Buffer;
var SyncObject = require('./sync_object');

Buffer.prototype.randomize = function() {
    var fd = fs.openSync('/dev/urandom', 'r');
    fs.readSync(fd, this, 0, this.length, 0);
    fs.closeSync(fd);
    return this;
}

function Store(){
	this.data = {};
	this.handlers = {};
	this.connections = {};
}

Store.prototype.store = function(id, obj){
	this.data[id] = obj;
}

Store.prototype.getUnusedHandlerId = function(){
	while(true){
		var randBuffer = new Buffer(100);
		var bufferString = randBuffer.toString('base64');
		if(this.handlers[bufferString] === undefined){
			this.handlers[bufferString] = 'in creation';
			return bufferString;
		}
	}
}

Store.prototype.serialize = function(id){
	var storeCopy = JSON.parse(JSON.stringify(this.get(id).get()));
	storeCopy.handlerKey = this.getUnusedHandlerId();
	this.handlers[storeCopy.handlerKey] = id;
	return JSON.stringify(storeCopy);
}

Store.prototype.get = function(id){
	if(this.data[id] === undefined){
		this.data[id] = new SyncObject();
	}
	return this.data[id];
}

Store.prototype.connect = function(handlerKey, callback){
	if(this.handlers[handlerKey] === undefined || this.handlers[handlerKey] === '0'){
		throw new Error("handler key not found");
	}
	var syncObj = this.get(this.handlers[handlerKey]);
	var callbackId = syncObj.registerOnChange(callback);
	this.connections[handlerKey] = {'callbackId': callbackId, 'id': this.handlers[handlerKey]};
	this.handlers[handlerKey] = '0';
	return true;
}

Store.prototype.disconnect = function(handlerKey){
	if(this.handlers[handlerKey] !== '0'){
		throw new Error("handler key not found or not used");
	}
	var data = this.connections[handlerKey];
	var syncObj = this.get(data.id);
	var callbackId = data.callbackId;
	syncObj.unregisterOnChange(callbackId);
	this.connections[handlerKey] = undefined;
	this.handlers[handlerKey] = undefined;
	return true;
}



module.exports = Store;
