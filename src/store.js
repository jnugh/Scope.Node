
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
}

Store.prototype.store = function(id, obj){
	this.data[id] = obj;
}

Store.prototype.getUnusedHandlerId = function(){
	while(true){
		var randBuffer = new Buffer(100);
		var bufferString = randBuffer.toString('base64');
		if(this.handlers[bufferString] === undefined){
			return bufferString;
		}
	}
}

Store.prototype.serialize = function(id){
	var storeCopy = JSON.parse(JSON.stringify(this.data[id].get()));
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

Store.prototype.connect = function(handlerKey){
	
}



module.exports = Store;
