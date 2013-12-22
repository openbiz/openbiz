/**
 * @class Application
 * @constructs openbiz.objects.Application
 * @param {object} options - an object of {modules:{},routes:{},policies:{}}
 * @returns {openbiz.objects.Application}
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 3.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
module.exports = require("./Object").extend(
{
    _context: null,

    /**
     * Application's modules
     * key/value pair of moduleName/moduleClass
     * @memberof openbiz.objects.Application
     * @type {object.<string,openbiz.objects.Module>}
     * @instance
     */
	modules  : {},


    /**
     * Application's security policies
     * key/value pair of policyName/policyFunction
     * @memberof openbiz.objects.Application
     * @type {object.<string,function>}
     * @instance
     */
	policies : {},


    /**
     * Application's routes
     * key/value pair of routeRule/Array of middle-wares
     * @memberof openbiz.objects.Application
     * @type {object.<string,function>}
     * @instance
     */
	routes 	 : {},

	ctor: function(options){		
		for(var i in options)
		{
			this[i] = options[i];
		}		
		return this;
	},


    /**
     * Mounts current application to specified URL router
     * @memberof openbiz.objects.Application
     * @instance
     * @param {string} routePrefix - The prefix of URL to mount this application instance
     * @returns {null}
     * @example
     * // init cubi app to routes => /app/*
     * openbiz.apps['cubi'].initRoutes('/api');
     */
	initRoutes: function(routePrefix)
	{
		if(routePrefix==='/')routePrefix='';
		var pattern = /^(.*?)\s(.*?)$/
		for(var routePath in this.routes)
		{
			var routePathArray = routePath.match(pattern);			
			openbiz.context[routePathArray[1]](routePrefix+routePathArray[2],this.routes[routePath]);			
		}
	}
});