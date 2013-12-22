"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(appName){
	console.log('start loading routes ...');	
	var filePath = path.join(openbiz.appRoot,appName,"routes.js"),
		routes={};
	if(fs.existsSync(filePath))
	{
		routes = require(filePath);
	}else{
		routes = {};
	}	
	return routes;
}