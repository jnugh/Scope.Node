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
	this.properties = properties;
}

SyncObject.prototype.update = function(properties){
	this.properties = mergeObjects(properties, this.properties);
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

module.exports = SyncObject;
