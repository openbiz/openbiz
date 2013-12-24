/**
 * @class Module
 * @classdesc
 * This module class provides some default methods for an openbiz application load up itself.
 * the main entry point of this module is {@link openbiz.objects.Module.loadModule} method.
 *
 * if you have an openbiz application's module which needs special logic to load itself, you can let it
 * in herit and extend from this class. and override beforeLoadModule() and afterLoadModule() methods.
 *
 * @constructs openbiz.objects.Module
 * @param {openbiz.objects.Application} appName - name of it's parent application
 * @param {string} moduleName - name of current module
 * @returns {openbiz.objects.Module}
 *
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
var fs = require('fs'),
	path=require('path');

module.exports = require("./Object").extend({
	_name : null,
	_app: null,
	_models : {},
	_controllers: {},
	ctor: function(app, moduleName){
		this._app = app;
		this._name = moduleName;
		this._models = {};
		this._controllers = {};
		return this;
	},


    /**
     * This is a callback method will be triggered before loadModules()
     *
     * default is does nothing
     *
     * @memberof openbiz.objects.Module
     * @abstract
     * @instance
     */
	beforeLoadModule:function(){},

    /**
     * This is a callback method will be triggered after loadModules()
     *
     * default is does nothing
     *
     * @memberof openbiz.objects.Module
     * @abstract
     * @instance
     */
	afterLoadModule:function(){},

    /**
     * Loads the module into application
     * @memberof openbiz.objects.Module
     * @returns {object.<string,object>}
     * @instance
     * @example
     * //example of an return value will looks like below
     * {
     *      models: {...},
     *      controllers: {...}
     * }
     */
	loadModule: function()
	{
		this.beforeLoadModule();
		var modulePath = path.join(this._app._path,"modules",this._name);
		this._loadControllers(modulePath);
		this._loadModels(modulePath);
		this.afterLoadModule();
		return {
			models: this._models,
			controllers: this._controllers
		}
	},

    /**
     * Loads all data models of current module
     * @memberof openbiz.objects.Module
     * @instance
     * @private
     * @ignore
     */
	_loadModels:function(modPath){
		modPath = path.join(modPath,"models");
		if(!fs.existsSync(modPath)) return;
		var selfPointer = this;
		fs.readdirSync(modPath).map(function(file){
			if( fs.statSync(path.join(modPath,file)).isFile() 
				&& file!='index.js' 
				&& path.extname(file)=='.js')
                {
                    selfPointer._models[path.basename(file,path.extname(file))] = selfPointer._app.getModel(selfPointer._name +"."+path.basename(file,path.extname(file)));
			    }
		});
	},

    /**
     * Loads all controllers of current module
     * @memberof openbiz.objects.Module
     * @instance
     * @private
     * @ignore
     */
	_loadControllers:function(modPath)
	{		
		modPath = path.join(modPath,"controllers");
		if(!fs.existsSync(modPath)) return;
		var selfPointer = this;
		fs.readdirSync(modPath).map(function(file){
			if( fs.statSync(path.join(modPath,file)).isFile() 
				&& file!='index.js' 
				&& path.extname(file)=='.js')
                {
				    selfPointer._controllers[path.basename(file,path.extname(file))] = selfPointer._app.getController(selfPointer._name +"."+path.basename(file,path.extname(file)));
                }
		});
	}
});
