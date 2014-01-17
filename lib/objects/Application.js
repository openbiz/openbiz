/**
 * @class Application
 * @classdesc
 * The Application object is containner of an openbiz based server side application.
 *
 * Each application module should based on this class to extend it's own feature.
 * The application itself can provides basic methods to get its controllers and models
 *
 * For easy to access, this class also alias as {@link openbiz.Application}.
 *
 * Normally the first thing after you instance an application class is call its {@link openbiz.objects.Application.loadToRoute | loadToRoute} methods to load itself to express router.
 * Otherwise even you have inited an openbiz application, you still cannot access it.
 *
 * @constructs openbiz.objects.Application
 * @param {object.<string,object>} options - an object of {modules:{},routes:{},policies:{}}
 * @returns {openbiz.objects.Application}
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 *
 * @todo 增加每个应用的配置功能
 *          app.config.get('setting-name')
 *          app.config.set('setting-name',value)
 *
 * @example
 * // below sample show you how to create a new application model which extends this module.
 * module.exports = function(openbiz)
 * {
 *     if(typeof openbiz != 'object') return null;
 *     var application = new openbiz.Application({
 *         _context : openbiz.context,
 *         _name : require('path').basename(__dirname),
 *         _path : __dirname,
 *         openbiz: openbiz
 *     });
 *     return application;
 * }
 */
'use strict';
module.exports = require("./Object").extend(
{
    _context: null,

    _name:null,

    _path:null,

    _ui:null,

    info:null,

    openbiz: null,

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

	ctor: function(options)
    {
		for(var i in options)
		{
			this[i] = options[i];
		}
        this.modules    = this.openbiz.loaders.ModuleLoader(this);
        this.policies   = this.openbiz.loaders.PolicyLoader(this);
        this.roles 	    = this.openbiz.loaders.RoleLoader(this);
        this.routes 	= this.openbiz.loaders.RouteLoader(this);
        this.info       = JSON.parse(require('fs')
                              .readFileSync(require('path').join(
                                        require('path').dirname(this._path),'package.json')
                                        ,'utf-8'));
        this.openbiz.apps[this._name] = this;
		return this;
	},
    uiUrl  : null,
    appUrl : null,
    /**
     * Mounts current application to specified URL router
     * @memberof openbiz.objects.Application
     * @instance
     * @param {string} routePrefix - The prefix of URL to mount this application instance
     * @returns {openbiz.objects.Application}
     * @example
     * // init cubi app to routes => /app/*
     * openbiz.apps['cubi'].initRoutes('/api');
     */
	loadAppToRoute: function(routePrefix)
	{
		if(routePrefix==='/')routePrefix='';
        this.appUrl = routePrefix;
		var pattern = /^(.*?)\s(.*?)$/
		for(var routePath in this.routes)
		{
			var routePathArray = routePath.match(pattern);			
			this.openbiz.context[routePathArray[1]](routePrefix+routePathArray[2],this.routes[routePath]);
		}
        return this;
	},

    loadUIToRoute: function(routePrefix)
    {
        if(this._ui == null ) return this;
        var self = this;
        this.uiUrl = routePrefix;
        var initUILib = function(){
            return function(req,res){
                var uiData = require('fs').readFileSync(require('path').join(self._ui,'main.js'));
                var setupAppURL = "appUrl:'"+self.appUrl+"'," ;
                uiData = uiData.toString().replace(/appUrl\s?\:\s?null,/,setupAppURL);
                var setupBaseURL = "baseUrl:'"+routePrefix+"'," ;
                uiData = uiData.toString().replace(/baseUrl\s?\:\s?null,/,setupBaseURL);
                res.set('Content-Type','application/javascript');
                res.send(200,uiData);
            }
        };
        this.openbiz.context.get(routePrefix+'/main.js',initUILib());
        this.openbiz.context.use(routePrefix,require('express').static(this._ui));
    },

    /**
     * This is an alias of {@link openbiz.services.ObjectService.getModel}
     * @memberof openbiz.objects.Application
     * @method
     * @instance
     * @see {@link openbiz.services.ObjectService.getModel}
     */
    getModel:function(objectName)
    {                
        return require("../services/ObjectService").getModel.call(this,objectName);
    },

    /**
     * This is an alias of {@link openbiz.services.ObjectService.getController}
     * @memberof openbiz.objects.Application
     * @method
     * @instance
     * @see {@link openbiz.services.ObjectService.getController}
     */
    getController:function(objectName)
    {
        return require("../services/ObjectService").getController.call(this,objectName);
    },


    /**
     * This is an alias of {@link openbiz.services.ObjectService.getPolicy}
     * @memberof openbiz.objects.Application
     * @method
     * @instance
     * @see {@link openbiz.services.ObjectService.getPolicy}
     */
    getPolicy:function(policyName)
    {
        return require("../services/ObjectService").getPolicy.call(this,policyName);
    },


    /**
     * This is an alias of {@link openbiz.services.ObjectService.getRole}
     * @memberof openbiz.objects.Application
     * @method
     * @instance
     * @see {@link openbiz.services.ObjectService.getRole}
     */
    getRole:function(roleName)
    {
        return require("../services/ObjectService").getRole.call(this,roleName);
    }
});