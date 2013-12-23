/**
 * The Object factory class.
 * Used for get specified Openbiz class
 *
 * @class ObjectService
 * @returns {openbiz.services.ObjectService}
 * @memberof openbiz.services
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */

"use strict";
var fs = require("fs"),
	path = require("path");
	
module.exports = {
    /**
     * Get specified openbiz data model class
     * @memberof openbiz.services.ObjectService
     * @param {string} objectName - The specified data model name
     * @returns {mongoose.Model}
     * @example
     * //below code is how to get a instance of "cubi.user.User" model
     * var userModel = openbiz.getModel("cubi.user.User");
     */
    getModel:function(objectName)
	{
        var app = this;
        var objectName = objectName.split(".");
        var obj = {};
        try
        {
            switch(objectName.length){
                case 1:
                    for(var module in app.modules)
                    {
                        if(app.modules[module].models.hasOwnProperty(objectName[0]))
                        {
                            objectName[1]=objectName[0];
                            objectName[0]=module;
                            break;
                        }
                    }
                    break;
            }
            obj = app.modules[objectName[0]].models[objectName[1]];
        }
        catch(e)
        {
            switch(objectName.length){
                case 1:
                    var modulePath = path.join(app._path,"modules");
                    fs.readdirSync(modulePath).forEach(function(moduleName){
                        var objFilePath = path.join(app._path,"modules",moduleName,"models",objectName[0]);
                        if(fs.existsSync(objFilePath+".js"))
                        {
                            var obj = require(objFilePath)(app);
                            if(typeof app.modules[moduleName] != "object") app.modules[moduleName]={};
                            if(typeof app.modules[moduleName].models != "object") app.modules[moduleName].models={};
                            app.modules[moduleName].models[objectName[0]] = obj;
                        }
                    });
                    break;
                case 2:
                    var objFilePath = path.join(app._path,"modules",objectName[0],"models",objectName[1]);
                    if(fs.existsSync(objFilePath+".js"))
                    {
                        var obj = require(objFilePath)(app);
                        if(typeof app.modules[objectName[0]] != "object") app.modules[objectName[0]]={};
                        if(typeof app.modules[objectName[0]].models != "object") app.modules[objectName[0]].models={};
                        app.modules[objectName[0]].models[objectName[1]] = obj;
                    }
                    break;
            }
        }
        return obj;
	},

    /**
     * Get specified openbiz controller class
     * @memberof openbiz.services.ObjectService
     * @param {string} objectName - The specified openbiz controller name
     * @returns {openbiz.objects.Controller}
     * @example
     * //below code is how to get a instance of "cubi.user.UserController" class
     * var myController = openbiz.getController("cubi.user.UserController");
     * //then you can access methods of our controlelrs
     * myController.ensureExists();
     */
    getController:function(objectName)
	{
        var app = this;
        var objectName = objectName.split(".");
        var obj = {};
        try
        {
            switch(objectName.length){
                case 1:
                    for(var module in app.modules)
                    {
                        if(app.modules[module].controllers.hasOwnProperty(objectName[0]))
                        {
                            objectName[1]=objectName[0];
                            objectName[0]=module;
                            break;
                        }
                    }
                    break;
            }
            obj = app.modules[objectName[0]].controllers[objectName[1]];
        }
        catch(e)
        {
            switch(objectName.length){
                case 1:
                    var modulePath = path.join(app._path,"modules");
                    fs.readdirSync(modulePath).forEach(function(moduleName){
                        var objFilePath = path.join(app._path,"modules",moduleName,"controllers",objectName[0]);
                        if(fs.existsSync(objFilePath+".js"))
                        {
                            var objClass = require(objFilePath)(app);
                            var obj = new objClass();
                            if(typeof app.modules[moduleName] != "object") app.modules[moduleName]={};
                            if(typeof app.modules[moduleName].controllers != "object") app.modules[moduleName].controllers={};
                            app.modules[moduleName].controllers[objectName[0]] = obj;
                        }
                    });
                    break;
                case 2:
                    var objFilePath = path.join(app._path,"modules",objectName[0],"controllers",objectName[1]);
                    if(fs.existsSync(objFilePath+".js"))
                    {
                        var objClass = require(objFilePath)(app);
                        var obj = new objClass();
                        if(typeof app.modules[objectName[0]] != "object") app.modules[objectName[0]]={};
                        if(typeof app.modules[objectName[0]].controllers != "object") app.modules[objectName[0]].controllers={};
                        app.modules[objectName[0]].controllers[objectName[1]] = obj;
                    }
                    break;
            }
        }
		return obj;
	},


    /**
     * Get specified openbiz policy middle-ware function
     * @memberof openbiz.services.ObjectService
     * @param {string} policyName - The specified policy middle-ware name
     * @returns {function}
     * @example
     * //below code is how to get the middle-ware of "cubi.user.ensureSomething" function
     * var something = openbiz.getPolicy("cubi.user.ensureSomething");
     */
    getPolicy:function(policyName)
	{
        var app = this;
		var objectName = policyName.split(".");
		var obj = {};
		try
		{
			obj = app.policies[objectName[1]];
		}
		catch(e)
		{					
			var objFilePath = path.join(app._path,"policies",policyName[0]);
			if(fs.existsSync(objFilePath+".js"))
			{
				obj = require(objFilePath);				
				if(typeof app.policies != "object") app.policies={};
				app.policies[objectName[1]] = obj;
			}
		}
		return obj;
	},

    /**
     * Get specified openbiz pre-defined system role
     * @memberof openbiz.services.ObjectService
     * @param {string} roleName - The specified system role name
     * @returns {array.<string>} Array of permission names,
     *                  the permission could be used by {@link openbiz.policies.ensurePermission} middle-ware for protect resource access
     * @example
     * //below code is how to get the role named "cubi-admin"
     * var cubiAdmin = openbiz.getRole("cubi-admin");
     *
     * //cubiAdmin will looks like below
     * // [
     * //   "cubi-user-manage",
     * //   "cubi-contact-manage",
     * //   "cubi-account-manage"
     * // ]
     */
    getRole:function(roleName)
	{
        var app = this;
		var role = [];
		try
		{
            role = app.roles[roleName];
		}
		catch(e)
		{
			var objFilePath = path.join(app._path,"roles",roleName);
			if(fs.existsSync(objFilePath+".js"))
			{
				role = require(objFilePath);
                if(typeof app.roles != "object") app.roles={};
				app.roles[roleName]= role;
			}
		}
		return role;
	}
}