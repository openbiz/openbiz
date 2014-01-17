"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app)
{
    var appRootPath = app._path;
    var roles={};
	console.log('start loading roles ...');	
	var appPath = path.join(appRootPath,"roles");
	if(!fs.existsSync(appPath)) return {};
	fs.readdirSync(appPath).map(function(file){
		if( fs.statSync(path.join(appPath,file)).isFile() 
			&& file!='index.js' 
			&& path.extname(file)=='.js'){
			console.log("\tloading role: " + path.basename(file,path.extname(file)));
            roles[path.basename(file,path.extname(file))] = app.getRole(path.basename(file,path.extname(file)));
		}
	});
	return roles;
};