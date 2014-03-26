"use strict";
var fs = require('fs'),
	_ = require('underscore');
module.exports = function(file, features, defaults){
	var data = fs.readFileSync(file, 'utf-8');
	var metadata = JSON.parse(data,function(key,value){		
		if(typeof value=='string'){
			var template = _.template(value);	
			value = template({ openbiz:this });
		}
		return value;
	});
	
	//apply matadata to schema
	if(typeof features=='undefined') features = {};
	if(!metadata.hasOwnProperty('_metadata') && features.enableMetadata)
	{
		metadata._metadata = require(__filename.replace(/\.js$/i,'.json')).RecordMetadata;
	}

	//apply default values
	if(typeof defaults=='undefined') defaults = {};
	if(typeof defaults.visibility.scope!='undefined'){
		metadata._metadata.visibility.scope.default = defaults.visibility.scope;
	}
	return metadata;
}