/*
 * Merges properties of o1 into o2
 */
function mergeObjects(o1, o2){
	for(var name in o1){
		if(typeof(o2[name]) === 'object'){
			o2[name] = mergeObjects(o1[name], o2[name]);
		} else {
			o2[name] = o1[name];
		}
	}
	return o2;
}

function SyncObject(properties){
	if(!properties){
		this.properties = {};
	} else {
		this.properties = properties;
	}
	this.callbacks = [];
}

SyncObject.prototype.populateChanges = function(){
	for(var i = 0; i < this.callbacks.length; i++){
		if(this.callbacks[i] !== undefined)
			this.callbacks[i]();
	}
}

SyncObject.prototype.update = function(properties){
	this.properties = mergeObjects(properties, this.properties);
	this.populateChanges();
}

SyncObject.prototype.get = function(key){
	if(key === undefined){
		return this.properties;
	}
	var path = key.split('.');
	var currentObj = this.properties;
	for(var i = 0; i < path.length; i++){
		currentObj = currentObj[path[i]];
		if(currentObj === undefined){
			return currentObj;
		}
	}
	return currentObj;
}

SyncObject.prototype.registerOnChange = function(callback){
	this.callbacks.push(callback);
	return this.callbacks.length - 1;
}

SyncObject.prototype.unregisterOnChange = function(id){
	if(this.callbacks[id] !== undefined){
		this.callbacks[id] = undefined;
	}
}

SyncObject.prototype.unset = function(id){
	delete this.properties[id];
}

SyncObject.prototype.isEmpty = function(){
	for(var prop in this.properties) {
		if(typeof(this.properties[prop]) === 'undefined'){
			continue;
		}
		if(this.properties.hasOwnProperty(prop)){
			return false;
		}
	}
	return true;
}

module.exports = SyncObject;
