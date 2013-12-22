/**
 * @module openbiz
 * @author Jixian Wang <jixian@openbiz.me>
 * @author Rocky Swen <rocky@openbiz.me>
 * @version 3.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
"use strict";
var path=require('path');
/**
 * Loads and inits the Openbiz system into global scope and assign an instance of
 * expressjs app as the context of openbiz.
 * @param {express} app - An instance of express app
 * @returns {!openbiz} Openbiz system environment
 */
module.exports = function(app)
{
    if (typeof openbiz != "undefined") return openbiz;
    
	console.log('init openbiz system ...');
    /**
     * @namespace openbiz
     * @author Jixian Wang <jixian@openbiz.me>
     * @version 3.0.0
     * @copyright {@link http://www.openbiz.me|Openbiz LLC}
     * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
     */
    var openbiz =
	{
		apps: {},
		appRoot: path.dirname(__dirname),
		context: app,
        /** @namespace openbiz.loaders */
		loaders:
		{			
			ModuleLoader: 	 require("./loaders/ModuleLoader"),
			PolicyLoader:    require("./loaders/PolicyLoader"),
			RouteLoader: 	 require("./loaders/RouteLoader"),
			RoleLoader: 	 require("./loaders/RoleLoader"),
			AppLoader: 		 require("./loaders/AppLoader")
		},
        /** @namespace openbiz.objects */
		objects:
		{
			Application: 	 require("./objects/Application"),
			Module: 	 	 require("./objects/Module"),
			Controller:  	 require("./objects/Controller"),
			Object: 	 	 require("./objects/Object")
		},
        /** @namespace openbiz.controllers */
		controllers:
		{
			ModelController: require("./controllers/ModelController")
		},
        /** @namespace openbiz.policies */
		policies:
		{
			ensurePermission: require("./policies/ensurePermission")
		},
        /** @namespace openbiz.routers */
        routers:
        {
            ModelRouter:     require("./routers/ModelRouter")
        },
		getModel: 			 require("./services/ObjectService").getModel,
		getController: 		 require("./services/ObjectService").getController,
		getPolicy: 			 require("./services/ObjectService").getPolicy,
		getRole: 			 require("./services/ObjectService").getRole
	};

    global.openbiz = openbiz;
	//setup methods alias
    /**
     * @memberof openbiz
     * @method
     * @return {AppLoader}  returns the Apploader object
     */
    openbiz.loadAppToRoute 	= openbiz.loaders.AppLoader;
    /**
     * @memberof openbiz
     * @method
     * @return {ensurePermission}  returns default openbiz middle-ware
     *                             that will ensure user has specified permission
     */
	openbiz.ensurePermission = openbiz.policies.ensurePermission;

	//setup classes alias
    /**
     * This is an easy way to access openbiz.objects.Object when
     * you want to create a Object with extend() feature
     * @memberof openbiz
     * @type {!Object}
     * @example
     * // create a new empty object and inherit from openbiz.Objbect
     * var myObject = openbiz.Object.extend();
     *
     * @example
     * // create a new object and inherit from openbiz.Objbect with some initialize properties
     * var myObject = openbiz.Object.extend({
     *    propertyA : defaultValue1,
     *    propertyB : defaultValue2,
     *    methodA : function(){
     *      //some logic here
     *    }
     * });
     */
	openbiz.Object 			= openbiz.objects.Object;

	openbiz.Application 	= openbiz.objects.Application;
	openbiz.Module 			= openbiz.objects.Module;
	openbiz.Controller		= openbiz.objects.Controller;	
	openbiz.ModelController = openbiz.controllers.ModelController;

	return global.openbiz;
};