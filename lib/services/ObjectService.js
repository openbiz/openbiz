/**
 * The Object factory class.
 * Used for get specified Openbiz class
 *
 * @class ObjectService
 * @returns {openbiz.services.ObjectService}
 * @memberof openbiz.services
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 3.0.0
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
		var objectName = objectName.split(".");
		var obj = {};
		try
		{
			obj = openbiz.apps[objectName[0]].modules[objectName[1]].models[objectName[2]];
		}
		catch(e)
		{
			var objFilePath = path.join(openbiz.appRoot,objectName[0],"modules",objectName[1],"models",objectName[2]);
			if(fs.existsSync(objFilePath+".js"))
			{
				obj = require(objFilePath);
				if(typeof openbiz.apps[objectName[0]] != "Object") openbiz.apps[objectName[0]]={};
				if(typeof openbiz.apps[objectName[0]].modules != "Object") openbiz.apps[objectName[0]].modules={};
				if(typeof openbiz.apps[objectName[0]].modules[objectName[1]] != "Object") openbiz.apps[objectName[0]].modules[objectName[1]]={};
				if(typeof openbiz.apps[objectName[0]].modules[objectName[1]].models != "Object") openbiz.apps[objectName[0]].modules[objectName[1]].models={};
				openbiz.apps[objectName[0]].modules[objectName[1]].models[objectName[2]] = obj;
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
		var objectName = objectName.split(".");
		var obj = {};
		try
		{
			obj = openbiz.apps[objectName[0]].modules[objectName[1]].controllers[objectName[2]];
		}
		catch(e)
		{					
			var objFilePath = path.join(openbiz.appRoot,objectName[0],"modules",objectName[1],"controllers",objectName[2]);				
			if(fs.existsSync(objFilePath+".js"))
			{
				var objClass = require(objFilePath);				
				if(typeof openbiz.apps[objectName[0]] != "Object") openbiz.apps[objectName[0]]={};
				if(typeof openbiz.apps[objectName[0]].modules != "Object") openbiz.apps[objectName[0]].modules={};
				if(typeof openbiz.apps[objectName[0]].modules[objectName[1]] != "Object") openbiz.apps[objectName[0]].modules[objectName[1]]={};
				if(typeof openbiz.apps[objectName[0]].modules[objectName[1]].controllers != "Object") openbiz.apps[objectName[0]].modules[objectName[1]].controllers={};
				obj = new objClass();				
				openbiz.apps[objectName[0]].modules[objectName[1]].controllers[objectName[2]] = obj;			
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
		var objectName = policyName.split(".");
		var obj = {};
		try
		{
			obj = openbiz.apps[objectName[0]].policies[objectName[1]];
		}
		catch(e)
		{					
			var objFilePath = path.join(openbiz.appRoot,objectName[0],"policies",objectName[1],"controllers",objectName[2]);				
			if(fs.existsSync(objFilePath+".js"))
			{
				obj = require(objFilePath);				
				if(typeof openbiz.apps[objectName[0]] != "Object") openbiz.apps[objectName[0]]={};
				if(typeof openbiz.apps[objectName[0]].policies != "Object") openbiz.apps[objectName[0]].policies={};				
				openbiz.apps[objectName[0]].policies[objectName[1]] = obj;			
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
		var roleName = roleName.split("-");
		var appName = roleName[0];
		var role = [];
		try
		{
			role = openbiz.apps[appName].roles[roleName];
		}
		catch(e)
		{
			var objFilePath = path.join(openbiz.appRoot,appName,"roles",roleName);
			if(fs.existsSync(objFilePath+".js"))
			{
				role = require(objFilePath);				
				if(typeof openbiz.apps[appName] != "Object") openbiz.apps[appName]={};
				if(typeof openbiz.apps[appName].roles != "Object") openbiz.apps[appName].roles={};
				openbiz.apps[appName].roles[roleName]= role;
			}
		}
		return role;
	}
}