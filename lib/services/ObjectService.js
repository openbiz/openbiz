/**
 * @class ObjectService
 * @classdesc
 * The Object factory class.
 * Used for get specified Openbiz class.
 *
 * The methods of ObjectService are extensions for  {@link openbiz.objects.Application},
 * please never call this directly by ObjectService.
 *
 * If need to call this method, you have to use javascript's function.apply(applicationPointer,params)
 * please see sample.
 *
 * @static
 * @returns {openbiz.services.ObjectService}
 * @memberof openbiz.services
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 * @example
 * //if you want to call this method directly , please try this way
 * require('openbiz/ObjectService').getModel.apply(applicationPointer,objectName)
 * @todo change example codes
 */

"use strict";
var fs = require("fs"),
	path = require("path");


module.exports = {
    /**
     * Get specified openbiz data model class
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     *
     * @memberof openbiz.services.ObjectService
     * @param {string} objectName - The specified openbiz controller name
     * @returns {openbiz.objects.Controller}
     * @example
     * //below code is how to get a instance of "openbiz-cubi.user.User" class
     * //cubiApp is instance of openbiz.objects.Application
     * var myModel = cubiApp.getModel("User");
     * //then you can access methods of this model like 'hasPermission()'
     * if(myModel.hasPermission('some-permission')){
     *  ...
     * }
     * @example
     * //if you want to call this method directly , please try this way
     * require('openbiz/services/ObjectService').getController.apply(applicationPointer,objectName)
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
            if(app.modules[objectName[0]].models.hasOwnProperty(objectName[1])){
                obj = app.modules[objectName[0]].models[objectName[1]];
            }else{                
                throw "not found";
            }
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
                            if( app.modules.hasOwnProperty(moduleName) &&
                                app.modules[moduleName].hasOwnProperty('models') && 
                                app.modules[moduleName].models.hasOwnProperty(objectName[0])){
                                var obj = app.modules[moduleName].models[objectName[0]];
                                return obj;
                            }else{
                                var obj = require(objFilePath)(app);
                                if(typeof app.modules[moduleName] != "object") app.modules[moduleName]={};
                                if(typeof app.modules[moduleName].models != "object") app.modules[moduleName].models={};     
                            }                                                
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
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     *
     * @memberof openbiz.services.ObjectService
     * @param {string} objectName - The specified openbiz controller name
     * @returns {openbiz.objects.Controller}
     * @example
     * //cubiApp is instance of openbiz.objects.Application
     * //then you can access methods of this model like 'hasPermission()'
     * //below code is how to get a instance of "cubi.user.UserController" class
     * var myController = cubiApp.getController("UserController");
     * //then you can access methods of our controlelrs
     * myController.ensureExists();
     * @example
     * //if you want to call this method directly , please try this way
     * require('openbiz/services/ObjectService').getController.apply(applicationPointer,objectName)
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

            if(app.modules[objectName[0]].controllers.hasOwnProperty(objectName[1])){
                obj = app.modules[objectName[0]].controllers[objectName[1]];
            }else{                
                throw "not found";
            }
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
     * Get specified openbiz policy middle-ware function.
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService.
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     * @memberof openbiz.services.ObjectService
     * @param {string} policyName - The specified policy middle-ware name
     * @returns {function}
     * @example
     * //below code is how to get the middle-ware of "cubi.user.ensureSomething" function
     * //cubiApp is instance of openbiz.objects.Application
     * var something = cubiApp.getPolicy("ensureSomething");
     * @example
     * //if you want to call this method directly , please try this way
     * require('openbiz/services/ObjectService').getPolicy.apply(applicationPointer,policyName)
     */
    getPolicy:function(policyName)
	{        
        var app = this;
		var objectName = policyName;
		var obj = {};
		try
		{
            if(app.policies.hasOwnProperty(policyName)){
                obj = app.policies[policyName];
            }else{                
                throw "not found";
            }
		}
		catch(e)
		{					
			var objFilePath = path.join(app._path,"policies",policyName);            
			if(fs.existsSync(objFilePath+".js"))
			{                
				obj = require(objFilePath);				
				if(typeof app.policies != "object") app.policies={};
				app.policies[policyName] = obj;
			}
		}        
		return obj;
	},

    /**
     * Get specified openbiz pre-defined system role.
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService.
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     * @memberof openbiz.services.ObjectService
     * @param {string} roleName - The specified system role name
     * @returns {array.<string>} Array of permission names,
     *                  the permission could be used by {@link openbiz.policies.ensurePermission} middle-ware for protect resource access
     * @example
     * //below code is how to get the role named "cubi-admin"
     * //cubiApp is instance of openbiz.objects.Application
     * var cubiAdmin = app.getRole("cubi-admin");
     *
     * //cubiAdmin will looks like below
     * // [
     * //   "cubi-user-manage",
     * //   "cubi-contact-manage",
     * //   "cubi-account-manage"
     * // ]
     * @example
     * //if you want to call this method directly , please try this way
     * require('openbiz/services/ObjectService').getRole.apply(applicationPointer,roleName)
     */
    getRole:function(roleName)
	{
        var app = this;
		var role = {permissions:[]};
		try
		{
            if(app.roles.hasOwnProperty(roleName)){
                role = app.roles[roleName];
            }else{                
                throw "not found";
            }
		}
		catch(e)
		{
			var objFilePath = path.join(app._path,"roles",roleName);
			if(fs.existsSync(objFilePath+".js"))
			{
				var roleConfig = require(objFilePath);
                if(typeof app.roles != "object") app.roles={};
				app.roles[roleName]= roleConfig.permissions;                    
                if(roleConfig.hasOwnProperty('isDefault') && roleConfig.isDefault == true){
                    app.defaultRoles.push(roleName);
                }
                role = roleConfig.permissions;
			}
		}
		return role;
	},
    /**
     * Get specified openbiz pre-defined system exception.
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService.
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     * @memberof openbiz.services.ObjectService
     * @param {string} exceptionName
     * @returns object Exception object
     *                  
     * @example
     * var Exception = app.openbiz.apps.xxxx.getExecption("Exception");
     *
     * throw new Exception(exceptionCode, error);
     * 
     */
    getExecption:function(exceptionName)
    {
        var app = this;
        var exception = {};
        try
        {
            if(app.exceptions.hasOwnProperty(exceptionName)){
                exception = app.exceptions[exceptionName];
            }else{                
                throw "not found";
            }
        }
        catch(e)
        {
            var objFilePath = path.join(app._path,"exceptions",exceptionName);
            if(fs.existsSync(objFilePath+".js"))
            {
                var exceptionConfig = require(objFilePath);
                if(typeof app.exceptions != "object") app.exceptions={};
                app.exceptions[exceptionName]= exceptionConfig;                    
                exception = exceptionConfig;
            }
        }
        return exception;
    },
    /**
     * Get specified openbiz pre-defined system nls.
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService.
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     * @memberof openbiz.services.ObjectService
     * @param {string} language code eg: en-US
     * @returns object 
     *                  
     * @example
     * // object will looks like below
     * // {
     * //    resetpassword: "Reset Password",
     * //    forgetpassword: "Forgot Password",
     * //    inviteuser: "Invite User",
     * //    createmechantuser: "Merchant user Register",
     * // }
     * var nls = app.openbiz.apps.core.nls['en-US'];
     *
     * var resetpassword = nls.resetpassword;
     * 
     */
    getNls:function(language)
    {
        var app = this;
        var nls = {};
        try
        {
            if(app.nls.hasOwnProperty(language)){
                nls = app.nls[language];
            }else{                
                throw "not found";
            }
        }
        catch(e)
        {
            var objFilePath = path.join(app._path,"nls",language);
            if(fs.existsSync(objFilePath+".js"))
            {
                var nlsConfig = require(objFilePath);
                if(typeof app.nls != "object") app.nls={};
                app.nls[language]= nlsConfig;                    
                nls = nlsConfig;
            }
        }
        return nls;
    },
    /**
     * Get specified openbiz pre-defined system nls.
     *
     * This method it part of {@link openbiz.objects.Application},
     * please never call this directly by ObjectService.
     *
     * if need to call this method, you have to use javascript's function.apply(applicationPointer,params)
     * please see sample
     * @memberof openbiz.services.ObjectService
     * @param {string} serviceName, eg: EmailService
     * @returns object 
     *                  
     * @example
     * // object will looks like below
     * // {
     * //    sendInviteMail: function(email, token, language){ }
     * // }
     * var EmailService = app.openbiz.apps.core.services['getService'];
     *
     * EmailService.sendInviteMail('xiuxu123@live.cn', 'xxxx-xx-xxx', 'zh-CN');
     * 
     */
    getService:function(serviceName)
    {
        var app = this;
        var services = {};
        try
        {
            if(app.services.hasOwnProperty(serviceName)){
                services = app.services[serviceName];
            }else{                
                throw "not found";
            }
        }
        catch(e)
        {
            var objFilePath = path.join(app._path,"services",serviceName);
            if(fs.existsSync(objFilePath+".js"))
            {
                var serviceConfig = require(objFilePath);
                if(typeof app.services != "object") app.services={};
                app.services[serviceName]= serviceConfig;                    
                services = serviceConfig;
            }
        }
        return services;
    }
}