"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app)
{
    var appRootPath = app._path;
    var exceptions={};
	console.log('start loading exceptions ...');	
	var appPath = path.join(appRootPath,"exceptions");
	if(!fs.existsSync(appPath)) return {};
	fs.readdirSync(appPath).map(function(file){
		if( fs.statSync(path.join(appPath,file)).isFile() 
			&& file!='index.js' 
			&& path.extname(file)=='.js'){
			console.log("\tloading exception: " + path.basename(file,path.extname(file)));
            exceptions[path.basename(file,path.extname(file))] = app.getExecption(path.basename(file,path.extname(file)));
		}
	});
	return exceptions;
};