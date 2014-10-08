"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app)
{
    var appRootPath = app._path;
    var nls={};
	console.log('start loading nls ...');	
	var appPath = path.join(appRootPath,"nls");
	if(!fs.existsSync(appPath)) return {};
	fs.readdirSync(appPath).map(function(file){
		if( fs.statSync(path.join(appPath,file)).isFile() 
			&& file!='index.js' 
			&& path.extname(file)=='.js'){
			console.log("\tloading language: " + path.basename(file,path.extname(file)));
            nls[path.basename(file,path.extname(file))] = app.getNls(path.basename(file,path.extname(file)));
		}
	});
	return nls;
};