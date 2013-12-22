"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(appName)
{
	console.log('start loading modules ...');	
	var appPath = path.join(openbiz.appRoot,appName,"modules");
	fs.readdirSync(appPath).map(function(dir){
		if(fs.statSync(path.join(appPath,dir)).isDirectory()){
			console.log("\tloading module: " + dir);
			if(fs.existsSync(path.join(appPath,dir,"index.js")))
			{
				var appModule = require(path.join(appPath,dir));			
			}else{
				var appModule = openbiz.Module;
			}
			exports[dir] = new appModule(appName,dir).loadModule();
		}
	});
	return exports;
};