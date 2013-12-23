"use strict";
var fs = require('fs'),
	path=require('path');
module.exports = function(app){
    var appRootPath = app._path;

	console.log('start loading routes ...');
    var routes={};
    //define route merge method
    var routeMerge = function(newRoutes)
    {
        for(var key in newRoutes)
        {
            if(routes.hasOwnProperty(key))
            {
                if(typeof routes[key] == 'Array')
                {
                    routes[key].push(newRoutes[key]);
                }
                else
                {
                    routes[key] = [routes[key],newRoutes[key]];
                }
            }
            else
            {
                routes[key] = newRoutes[key];
            }
        }
    }

    //load modules routes
    var appPath = path.join(appRootPath,"modules");
    if(fs.existsSync(appPath))
    {
        fs.readdirSync(appPath).map(function(dir){
            if(fs.statSync(path.join(appPath,dir)).isDirectory()){
                if(fs.existsSync(path.join(appPath,dir,"routes.js")))
                {
                    console.log("\tloading module routes: " + dir);
                    routeMerge(require(path.join(appPath,dir,"routes.js"))(app));

                }
            }
        });
    }

    //load app's routes
    var filePath = path.join(appRootPath,"routes.js");
	if(fs.existsSync(filePath))
	{
        routeMerge(require(filePath)(app));
	}
	return routes;
}