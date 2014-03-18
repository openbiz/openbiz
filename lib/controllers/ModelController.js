/**
 * @class ModelController
 * @classdesc
 * Openbiz Model Controller class for operate a defined data model,
 * It ships with all ready to use CRUD methods.
 *
 * @constructs openbiz.controllers.ModelController
 * @returns {openbiz.controllers.ModelController}
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
module.exports = function(app, name){
	var controller = require("../objects/Controller").extend({
		_model:null,
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
			getSelf().beforeCreate(req, res);
			app.getModel.call(app,getSelf()._model).create(req.body,function(err,record){
				if(err){
					res.json(500,{error:err});
				}
				else{
					getSelf().afterCreate(req, res);
					res.json(201,record);
				}
			});
		},
		getItem:function(req,res){
			getSelf().beforeGetItem();
			res.json(200,req.record);
			getSelf().afterGetItem();
		},
		getCollection: function(req, res){
			getSelf().beforeGetCollection(req, res);
			var model = app.getModel.call(app,getSelf()._model);
	//			query=rr&page=1&per_page=3&total_pages=0&total_entries=0&sort_by=expiredDate&order=desc
			//page=1&per_page=3&total_pages=2&total_entries=4&sort_by=data.contact.name.displayName&order=asc

			var queryConditions = {};
			if(req.query.query){
				queryConditions['$or'] = [];
				for(var field in model.schema.paths){
					if(model.schema.paths[field].instance!='ObjectID'){
						var fieldCond = {};
						fieldCond[field]={ $regex: req.query.query, $options: 'i' } ;
						queryConditions['$or'].push ( fieldCond );
					}
				}
			}

			var async = require('async');
			async.series({
				count:function(cb){
					var query = model.find(queryConditions).count(function(err,count){
						cb(err,count);
					});
				},items:function(cb){
					var page = req.query.page?req.query.page-1:0;
					var pageSize = req.query.per_page?req.query.per_page:0;
					var sort = req.query.sort_by;
					var order = req.query.order;

					var query = model.find(queryConditions).skip(parseInt(page * pageSize)).limit(pageSize);
					if(sort && order){
						query = query.sort({sort:order});
					}else{
						query = query.sort({_id:"desc"});
					}
					query.exec(function(err,collection){
						req.recordCollection = collection;
						cb(err,collection);
					});
				}
			},function(err,results){
				if(err){
					res.json(500,{error:err});
				}
				else{					
					getSelf().afterGetCollection(req, res);
					res.json(200,results);
				}
			});
		},
		delete:function(req,res){
			getSelf().beforeDelete(req, res);
			req.record.remove(function(err){
				if(err){
					res.json(500,{error:err});
				}
				else{
					getSelf().afterDelete(req, res);
					res.send(204);
				}
			});		
		},
		update:function(req,res){
			getSelf().beforeUpdate(req, res);
			for(var i in req.body){
				req.record[i] = req.body[i];
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
			})
		}	
	});
	
	var getSelf = function(){
		return app.getController(name);
	}

	return controller;
};
