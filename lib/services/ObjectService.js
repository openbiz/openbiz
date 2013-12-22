"use strict";
var fs = require("fs"),
	path = require("path");
	
module.exports = {
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