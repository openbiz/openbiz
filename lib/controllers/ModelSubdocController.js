/**
 * @class ModelSubdocController
 * @classdesc
 * Openbiz Model Subdoc Controller class for operate a defined data model,
 * It ships with all ready to use CRUD methods.
 *
 * @constructs openbiz.controllers.ModelSubdocController
 * @returns {openbiz.controllers.ModelSubdocController}
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
var _ = require('underscore');
module.exports = function(app, name){
	var controller = require("../objects/Controller").extend({
		_model:null,
		_path:null,
		//default data get method
		//trigger method for data collection get
		//The fetched record is at req.record
		beforeGetItem: function(req, res){},
		afterGetItem: function(req, res){},

		//trigger method for data collection fetch
		//The fetched records is at req.recordCollection
		beforeGetCollection: function(req, res){},
		afterGetCollection: function(req, res){},

		//trigger method for data create
		//The created record is at req.record
		beforeCreate: function(req, res){},
		afterCreate: function(req, res){},

		//trigger method for data update
		//The old record is at req.record
		//The new record is at req.recordNew
		beforeUpdate: function(req, res){},
		afterUpdate: function(req, res){},


		//trigger method for data delete
		//The old record is at req.record
		beforeDelete: function(req, res){},
		afterDelete: function(req, res){},

		ensureExists:function(req,res,next){
			app.getModel.call(app,getSelf()._model).findById(req.params.id,function(err,record){
				if(err){
					res.json(500,{error:err});
				}else if(record){
					req.record = record;
					next();
				}else{
					res.send(404);
				}
			});
		},
		create:function(req,res){
			if(!getSelf().ensurePromission()){res.send(401);return;}
			getSelf().beforeCreate(req, res);
			getSelf().processChange(req,"ADD",req.body);
			req.record.get(getSelf()._path).push(req.body);
			req.record.save(function(err){
				if(err){
					res.json(500,{error:err});
				}
				else{
					getSelf().afterCreate(req, res);
					res.send(201,req.body);
				}
			});
		},
		getItem:function(req,res){
			getSelf().beforeGetItem();
			var item = req.record.get(getSelf()._path).id(req.params.subId);
			if(item){
				res.json(200,item);
			}else{
				res.send(406);
			}
			getSelf().afterGetItem();
		},
		getCollection: function(req, res){
			getSelf().beforeGetCollection(req, res);
			var results = app.openbiz.services.ArrayPaginator(req.record.get(getSelf()._path),req.query);
			res.json(200,{count:req.record.get(getSelf()._path).length,items:results[1]});
			getSelf().afterGetCollection(req, res);
		},
		delete:function(req,res){
			if(!getSelf().ensurePromission()){res.send(401);return;}
			getSelf().beforeDelete(req, res);
			var item = req.record.get(getSelf()._path).id(req.params.subId);
			if(item == null){
				res.send(304);
			}
			else{
				getSelf().processChange(req,"DELETE",item);
				req.record.get(getSelf()._path).remove(item);
				req.record.save(function(err){
					if(err){
						res.json(500,{error:err});
					}
					else{
						getSelf().afterDelete(req, res);
						res.send(204);
					}
				});
			}
		},
		update:function(req,res){
			if(!getSelf().ensurePromission()){res.send(401);return;}
			getSelf().beforeUpdate(req, res);
			var item = req.record.get(getSelf()._path).id(req.params.subId);
			if(item == null){
				res.send(304);
			}else{
				getSelf().processChange(req,"UPDATE",item);
				for(var i in req.body){
					item[i] = req.body[i];
				}
				req.record.save(function(err){
					if(err){
						res.json(500,{error:err});
					}
					else{
						req.recordNew = req.record;
						getSelf().afterUpdate(req, res);
						res.send(204);
					}
				});
			}
		},
		processChange:function(req,action,item){
			var updateLog = {
				id:req.user.id,
				path:getSelf()._path,
				original:{},
				current:{},
				action:action
			};
			switch(action){
				case "UPDATE": {
					for(var i in req.body){
						if(!_.isEqual(item[i], req.body[i])){
							updateLog.original[i] = item[i];
							updateLog.current[i] = req.body[i];
						}
					}
					if(!_.isEmpty(updateLog.original)){
						req.record._metadata.updates.push(updateLog);
					}
					break;
				}
				case "DELETE":{
					updateLog.original = item;
					req.record._metadata.updates.push(updateLog);
					break;
				}
				case "ADD":{
					updateLog.current = item;
					req.record._metadata.updates.push(updateLog);
					break;
				}
				default:break;
			}
		},
		ensurePromission:function(){
			//TODO: 以后添加
			return true;
		}
	});

	var getSelf = function(){
		return app.getController(name);
	}

	return controller;
};
