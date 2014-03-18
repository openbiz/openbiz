/**
 * @module openbiz
 * @author Jixian Wang <jixian@openbiz.me>
 * @author Rocky Swen <rocky@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
"use strict";
var path=require('path'),
    mongoose = require('mongoose'),
    underscore = require('underscore');
/**
 * Loads and inits the Openbiz system assign an instance of
 * expressjs app as the context of openbiz.
 * @param {express} app - An instance of express app
 * @param {object.<string,object>} options - setting for init openbiz environment, more detail please see sample
 * @returns {!openbiz} Openbiz system environment
 * @example
 * //config options sample
 * var options =
 * {
 *      db:{
 *          uri:'localhost/myAppDB'
 *      }
 * }
 * var openbiz = require('openbiz')(app,config);
 */
module.exports = function(app,options)
{
    console.log('init database connection ...'+options.db.uri);
    //setup mongoose
    var db = mongoose.createConnection(options.db.uri,{auto_reconnect: true});
    db.on('error', console.error.bind(console, 'mongoose connection error: '));
    db.once('open', function () {
        //and... we have a data store
        console.log("mongo database server connected.");
    });


    console.log('init openbiz system ...');
    /**
     * @namespace openbiz
     * @author Jixian Wang <jixian@openbiz.me>
     * @version 4.0.0
     * @copyright {@link http://www.openbiz.me|Openbiz LLC}
     * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
     */
    var openbiz =
	{
        /**
         * The container of loaded openbiz based application
         * it will used for internnally reference to app, used by {@link openbiz.getApp|openbiz::getApp(appName)} function
         * @memberof openbiz
         * @type {object.<string,openbiz.objects.Application>}
         */
		apps: {},
        loadedAppUIs:[],
        /**
         * The root folder of referceing app's root path.
         * @memberof openbiz
         * @property appRoot
         * @type string
         * @example
         * // if your have an instances of openbiz then below code can help you to get openbiz system's root path
         * var systemRootPath = openbiz.appRoot;
         */
		appRoot: path.dirname(require.main.filename),
        /**
         * A context reference for express app.
         * Just in case of if need to access express's method
         * @memberof openbiz
         * @type {express}
         * @example
         * //below sample shows how to access some express app's setting
         * //lets say we have setup some setting in express app
         * app.set('project-name', "My greate openbiz powered project! ");
         * //init openbiz system
         * var openbiz = require('openbiz')(app);
         *
         * ...
         *
         * in some other files if you want to access it
         * var projectName = openbiz.context.get('project-name');
         */
		context: app,
        _:underscore,
        db: db,
        mongoose: mongoose,
        /**
         * Namespace of Openbiz loader classes
         * @namespace openbiz.loaders */
		loaders:
		{			
			ModuleLoader: 	 require("./loaders/ModuleLoader"),
			PolicyLoader:    require("./loaders/PolicyLoader"),
			RouteLoader: 	 require("./loaders/RouteLoader"),
			RoleLoader: 	 require("./loaders/RoleLoader")
		},
        /**
         * Namespace of Openbiz base object classes
         * @namespace openbiz.objects */
		objects:
		{
			Application: 	 require("./objects/Application"),
			Module: 	 	 require("./objects/Module"),
			Controller:  	 require("./objects/Controller"),
			Object: 	 	 require("./objects/Object")
		},
        /**
         * Namespace of Openbiz ready to use controller classes
         * @namespace openbiz.controllers */
		controllers:
		{
			ModelController: require("./controllers/ModelController"),
            ModelSubdocController: require("./controllers/ModelSubdocController")
		},
        /**
         * Namespace of Openbiz ready to use route middle-ware policy classes
         * @namespace openbiz.policies */
		policies:
		{
			ensurePermission: require("./policies/ensurePermission"),
			enforceSSL: require("./policies/enforceSSL")
		},
        /**
         * Namespace of Openbiz ready to use router classes
         * @namespace openbiz.routers */
        routers:
        {
            ModelRouter:     require("./routers/ModelRouter")
        },
        /**
         * Namespace of Openbiz service classes,
         * Mostly each service containes some resueable methods or extension
         * methods for other class to void the class file become too huge to read.
         * @namespace openbiz.services */
        services:
        {
            ObjectService:     require("./services/ObjectService"),
            ArrayPaginator:    require("./services/ArrayPaginator")
        },
        /**
         * get a loaded openbiz application instances
         * @memberof openbiz
         * @method
         * @param {string} appName - name of a loaded openbiz application
         * @return {?openbiz.objects.Application} the instance of specified openbiz application
         * @instance
         * @example
         * //if you already loaded the openbiz-cubi app
         * var cubiApp = openbiz.getApp('openbiz-cubi');
         * var myPoclicyName = cubiApp.getPolicy('policyName');
         */
		getApp:function(appName){
            if(this.apps.hasOwnProperty(appName)){
                return this.apps[appName];
            }else{
                return null;
            }
        },

        roles:[],
        /**
         * This is an alias of {@link openbiz.services.ObjectService.getRole}
         * @memberof openbiz.objects.Application
         * @method
         * @instance
         * @see {@link openbiz.services.ObjectService.getRole}
         */
        getRole:function(roleName)
        {

            if(this.roles.hasOwnProperty(roleName)){
                return this.roles.roleName;
            }
            for(var i in this.apps){                
                if( this.apps[i].roles.hasOwnProperty(roleName) ){
                    this.roles.push(this.apps[i].roles[roleName]);
                    return this.apps[i].roles[roleName];
                }
            }
        },
        info: JSON.parse(require('fs').readFileSync(path.join(path.dirname(__dirname),'package.json'),'utf-8'))
	};

	//setup methods alias

    /**
     * This is an alias of {@link openbiz.policies.ensurePermission}
     * @method
     * @memberof openbiz
     * @see {@link openbiz.policies.ensurePermission}
     */
	openbiz.ensurePermission = openbiz.policies.ensurePermission;

    /**
     * This is an alias of {@link openbiz.policies.enforceSSL}
     * @method
     * @memberof openbiz
     * @see {@link openbiz.policies.enforceSSL}
     */
    openbiz.enforceSSL = openbiz.policies.enforceSSL;

	//setup classes alias
    /**
     * This is an alias of {@link openbiz.objects.Object}
     * @memberof openbiz
     * @see {@link openbiz.objects.Object}
     */
	openbiz.Object 			= openbiz.objects.Object;

    /**
     * This is an alias of {@link openbiz.objects.Application}
     * @memberof openbiz
     * @see {@link openbiz.objects.Application}
     */
	openbiz.Application 	= openbiz.objects.Application;

    /**
     * This is an alias of {@link openbiz.objects.Module}
     * @memberof openbiz
     * @see {@link openbiz.objects.Module}
     */
	openbiz.Module 			= openbiz.objects.Module;

    /**
     * This is an alias of {@link openbiz.objects.Controller}
     * @memberof openbiz
     * @see {@link openbiz.objects.Controller}
     */
	openbiz.Controller		= openbiz.objects.Controller;

    /**
     * This is an alias of {@link openbiz.controllers.ModelController}
     * @memberof openbiz
     * @see {@link openbiz.controllers.ModelController}
     */
    openbiz.ModelController = openbiz.controllers.ModelController;

    openbiz.ModelSubdocController = openbiz.controllers.ModelSubdocController;

    app.openbiz = openbiz;
	return openbiz;
};