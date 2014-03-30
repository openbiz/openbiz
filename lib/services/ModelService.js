"use strict";
var fs = require('fs'),
	_ = require('underscore');
module.exports = {
	applyMetadata:function(schema, features, defaults){
		//apply matadata to schema
		var metadata = schema;		
		if(typeof features=='undefined') features = {};
		if(!metadata.hasOwnProperty('_metadata') && features.enableMetadata)
		{
			var data = fs.readFileSync(__filename.replace(/\.js$/i,'.json'), 'utf-8');
			var config = JSON.parse(data,function(key,value){		
				if(typeof value=='string'){
					var template = _.template(value);	
					value = template({ openbiz:this });
				}
				return value;
			});

			metadata._metadata = config.RecordMetadata;
		}

		//apply default values
		if(typeof defaults!='undefined' && features.enableMetadata){
			if(typeof defaults.visibility!='undefined'){
				if(typeof defaults.visibility.scope!='undefined'){
					metadata._metadata.visibility.scope.default = defaults.visibility.scope;
				}
			}
		}
		return metadata;
	}
}