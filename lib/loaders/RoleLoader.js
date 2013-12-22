"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(appName){
	console.log('start loading roles ...');	
	var appPath = path.join(openbiz.appRoot,appName,"roles");
	if(!fs.existsSync(appPath)) return {};
	fs.readdirSync(appPath).map(function(file){
		if( fs.statSync(path.join(appPath,file)).isFile() 
			&& file!='index.js' 
			&& path.extname(file)=='.js'){
			console.log("\tloading role: " + path.basename(file,path.extname(file)));
			exports[path.basename(file,path.extname(file))] = require(path.join(appPath,file));
		}
	});
	return exports;
}