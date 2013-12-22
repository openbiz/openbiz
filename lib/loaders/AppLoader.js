/**
 * Load and mount specified application as resource to under a route path.
 * for example you may want to mount cubi to http://server-host/api/*
 *
 * @memberof openbiz.loaders
 * @method
 * @function AppLoader
 * @param {string} appName - name of openbiz application
 * @param {string} routePrefix - route prefix which to mount the application to.
 * @return {openbiz.objects.Application}  returns an instance of {@link openbiz.objects.Application}
 * @example
 * // app is an instance of express js
 * var openbiz = require('openbiz')(app);
 * openbiz.loadAppToRoute('cubi','/api');
 *
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 3.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
"use strict";
var util = require("util");
module.exports = function(appName, routePrefix)
{
	openbiz.apps[appName] = new openbiz.Application({
		_context : this.context,
		modules  : this.loaders.ModuleLoader(appName),
		policies : this.loaders.PolicyLoader(appName),
		roles 	 : this.loaders.RoleLoader(appName),
		routes 	 : this.loaders.RouteLoader(appName)
	});
	openbiz.apps[appName].initRoutes(routePrefix);
    return openbiz.apps[appName];
}