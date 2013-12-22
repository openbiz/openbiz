"use strict";
var util = require("util");
module.exports = function(appName, routePrefix)
{
	openbiz.apps[appName] = new openbiz.Application({
		_context : this.context,
		modules  : this.loaders.ModuleLoader(appName),
		policies : this.loaders.PolicyLoader(appName),
		roles 	 : this.loaders.RoleLoader(appName),
		routes 	 : this.loaders.RouteLoader(appName),
	});
	openbiz.apps[appName].initRoutes(routePrefix);
}