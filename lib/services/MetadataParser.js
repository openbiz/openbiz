"use strict";
var fs = require('fs'),
	_ = require('underscore');
module.exports = function(file){
	var data = fs.readFileSync(file, 'utf-8');
	var metadata = JSON.parse(data,function(key,value){		
		if(typeof value=='string'){
			var template = _.template(value);	
			value = template({
				openbiz:this
			});
		}
		return value;
	});
	return metadata;
}