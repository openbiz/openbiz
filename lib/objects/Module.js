/**
 * @class Module
 * @constructs openbiz.objects.Module
 * @param {String} appName - name of it's parent application
 * @param {String} moduleName - name of current module
 * @returns {openbiz.objects.Module}
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 3.0.0
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
	ctor: function(appName, moduleName){
		this._app = appName;
		this._name = moduleName;
		this._models = {};
		this._controllers = {};
		return this;
	},


    /**
     * A callback method will be triggered before loadModules()
     * default is does nothing
     * @memberof openbiz.objects.Module
     * @instance
     */
	beforeLoadModule:function(){},

    /**
     * A callback method will be triggered after loadModules()
     * default is does nothing
     * @memberof openbiz.objects.Module
     * @instance
     */
	afterLoadModule:function(){},

    /**
     * Loads the module into application
     * @memberof openbiz.objects.Module
     * @returns {object}
     * {
     *      models:{},
     *      controllers:{}
     * }
     * @instance
     */
	loadModule: function()
	{
		this.beforeLoadModule();
		var modulePath = path.join(openbiz.appRoot,this._app,"modules",this._name);
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
				&& path.extname(file)=='.js'){
				var objName = selfPointer._app+"."+selfPointer._name+"."+path.basename(file,path.extname(file));	
				selfPointer._models[path.basename(file,path.extname(file))] = openbiz.getModel(objName);
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
				&& path.extname(file)=='.js'){
				var objName = selfPointer._app+"."+selfPointer._name+"."+path.basename(file,path.extname(file));				
				selfPointer._controllers[path.basename(file,path.extname(file))] = openbiz.getController(objName);
			}
		});
	}
});
