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
		beforeGetItem: function(req, res, next){next();},
		afterGetItem: function(req, res){},

		//trigger method for data collection fetch
		//The fetched records is at req.recordCollection
		beforeGetCollection: function(req, res, next){next();},
		afterGetCollection: function(req, res, next){},

		//trigger method for data create
		//The created record is at req.record
		beforeCreate: function(req, res, next){next();},
		afterCreate: function(req, res){},

		//trigger method for data update
		//The old record is at req.record
		//The new record is at req.recordNew
		beforeUpdate: function(req, res, next){next();},
		afterUpdate: function(req, res){},


		//trigger method for data delete
		//The old record is at req.record
		beforeDelete: function(req, res, next){next();},
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
			getSelf().beforeCreate(req, res,function(){
				getSelf().processChangeLog(req,"ADD",req.body);
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
			});
		},
		getItem:function(req,res){
			getSelf().beforeGetItem(req,res,function(){
				var item = req.record.get(getSelf()._path).id(req.params.subId);
				if(item){
					res.json(200,item);
				}else{
					res.send(406);
				}
				getSelf().afterGetItem();
			});
		},
		getCollection: function(req, res){
			getSelf().beforeGetCollection(req, res,function(){
				getSelf().afterGetCollection(req, res,function(){
					var results = app.openbiz.services.ArrayPaginator(req.record.get(getSelf()._path),req.query);
					res.json(200,results);
				});
			});
		},
		delete:function(req,res){
			getSelf().beforeDelete(req, res,function(){
				var item = req.record.get(getSelf()._path).id(req.params.subId);
				if(item == null){
					res.send(304);
				}
				else{
					getSelf().processChangeLog(req,"DELETE",item);
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
			});
		},
		update:function(req,res){
			getSelf().beforeUpdate(req, res,function(){
				var item = req.record.get(getSelf()._path).id(req.params.subId);
				if(item == null){
					res.send(304);
				}else{
					getSelf().processChangeLog(req,"UPDATE",item);
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
			});
		},
		processChangeLog:function(req,action,item){
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
						if(_.isDate(req.record[i])){
							req.body[i] = new Date(req.body[i]);
						}
						if(!_.isEqual(item[i].toString(), req.body[i].toString())){
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
		}
	});

	var getSelf = function(){
		return app.getController(name);
	}

	return controller;
};
