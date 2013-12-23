"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app)
{
    var appRootPath = app._path;
    console.log('start loading policies ...');
	var appPath = path.join(appRootPath,"policies");
	if(!fs.existsSync(appPath)) return {};
	fs.readdirSync(appPath).map(function(file){
		if( fs.statSync(path.join(appPath,file)).isFile() 
			&& file!='index.js' 
			&& path.extname(file)=='.js'){
			console.log("\tloading policy middleware: " + path.basename(file,path.extname(file)));
			exports[path.basename(file,path.extname(file))] = app.getPolicy(path.basename(file,path.extname(file)));
		}
	});
	return exports;
}