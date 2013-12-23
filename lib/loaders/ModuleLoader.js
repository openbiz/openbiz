"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app)
{
	console.log('start loading modules ...');
    var appRootPath = app._path;
	var appPath = path.join(appRootPath,"modules");
    if(fs.existsSync(appPath))
    {
        fs.readdirSync(appPath).map(function(dir){
            if(fs.statSync(path.join(appPath,dir)).isDirectory()){
                console.log("\tloading module: " + dir);
                if(fs.existsSync(path.join(appPath,dir,"index.js")))
                {
                    var appModule = require(path.join(appPath,dir));
                }
                else
                {
                    var appModule = app.openbiz.Module;
                }
                exports[dir] = new appModule(app,dir).loadModule();
            }
        });
    }
	return exports;
};