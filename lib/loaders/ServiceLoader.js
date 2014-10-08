"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app)
{
    var appRootPath = app._path;
    var services={};
	console.log('start loading services ...');	
	var appPath = path.join(appRootPath,"services");
	if(!fs.existsSync(appPath)) return {};
	fs.readdirSync(appPath).map(function(file){
		if( fs.statSync(path.join(appPath,file)).isFile() 
			&& file!='index.js' 
			&& path.extname(file)=='.js'){
			console.log("\tloading service: " + path.basename(file,path.extname(file)));
            services[path.basename(file,path.extname(file))] = app.getService(path.basename(file,path.extname(file)));
		}
	});
	return services;
};