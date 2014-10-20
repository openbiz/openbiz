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
var _ = require('underscore');
var async = require('async');
module.exports = function(app, name){
	var Exception = require("../exception/Exception");
	var controller = require("../objects/Controller").extend({
		_model:null,
		//default data get method
		//trigger method for data collection get
		//The fetched record is at req.record
		beforeGetItem: function(req, res, next){next();},
		afterGetItem: function(req, res){
			if("getOutput" in req.record){
            	req.record = req.record.getOutput();
			}
		},

		//trigger method for data collection fetch
		//The fetched records is at req.recordCollection
		beforeGetCollection: function(req, res, next){next();},
		beforeQueryCollection: function(req,query){return query;},
		afterGetCollection: function(req, res,next){
			var records = req.recordCollection;

			var array = records.map(function(item, index){
				return item.getOutput();
			});

			req.recordCollection = array;
            next();
		},

		//trigger method for data create
		//The created record is at req.record
		beforeCreate: function(req, res, next){next();},
		afterCreate: function(req, res){
			if("getOutput" in req.newRecord){
            	req.newRecord = req.newRecord.getOutput();
			}
		},

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
					throw new Exception(500, err, res);
				}else if(record){
					req.record = record;
					next();
				}else{
					res.send(404);
				}
			});
		},
		create:function(req,res){
			getSelf().beforeCreate(req, res, function(){
				try{
					var input = req.body;

					var model = app.getModel.call(app,getSelf()._model);

					for(var field in model.schema.paths){
						if(field == 'userId'){
							input[field] = req.user.social.socialId;
							break;
						}
					}
					
					app.getModel.call(app,getSelf()._model).create(input,function(err,record){
						if(err){
							throw new Exception(500, err, res);
						}
						else{
							req.newRecord = record;
							getSelf().afterCreate(req, res);
							res.json(201,req.newRecord);
						}
					});
				}catch(e){
					throw new Exception(500, e, res);
				}
			});
		},
		getItem:function(req,res){
			getSelf().beforeGetItem(req,res,function(){
				getSelf().afterGetItem(req,res);
				res.json(200,req.record);
			});
		},
		getCollection: function(req, res){
			getSelf().beforeGetCollection(req, res, function(){
				var model = app.getModel.call(app,getSelf()._model);
				var queryConditions = {};
				if(req.query.query){
					if(req.query.query.split(":").length > 1)
					{
						var queryArr = req.query.query.split(" ");
						for(var i in queryArr){
							var query = queryArr[i].split(":");
							if(query.length == 2){
								queryConditions[query[0]] = new RegExp(query[1],"i");
							}
						}
					}
					else
					{
						queryConditions['$or'] = [];
						for(var field in model.schema.paths){
							if(model.schema.paths[field].instance!='ObjectID'){
								var fieldCond = {};
								// fieldCond[field]={ $regex: req.query.query, $options: 'i' } ;
								if(field.indexOf('__')==0) continue;
								if(field.indexOf('_metadata')==0)continue;
								var fieldObj = model.schema.paths[field];
								if(typeof fieldObj.options=='undefined') fieldObj.options = {type:null};
								switch(fieldObj.options.type){
									case "Date":
									case "Number":
										//fieldCond[field] = req.query.query;
										break;
									default:
										if(!(fieldObj.options.type instanceof Array)){
											fieldCond[field] = new RegExp(req.query.query,"i");
											queryConditions['$or'].push ( fieldCond );
										}
										break;
								}

							}
						}
					}
				}

				var pageSize = req.query.per_page?req.query.per_page:0;
				var page = req.query.page?req.query.page-1:0;

				var mainQuery = model.find(queryConditions);
				mainQuery = getSelf().beforeQueryCollection(req,mainQuery);

				async.series({
					count:function(cb){
						var query = _.clone(mainQuery);
						query.count(function(err,count){
							cb(err,count);
						});
					},items:function(cb){
						var sort = req.query.sort_by;
						var order = req.query.order;

						var query = _.clone(mainQuery);

						query.skip(parseInt(page * pageSize)).limit(pageSize);
						if(sort && order){
							query = query.sort({sort:order});
						}else{
							query = query.sort({_id:"desc"});
						}
						query = getSelf().beforeQueryCollection(req,query);
						query.exec(function(err,collection){
							req.recordCollection = collection;
							cb(err,collection);
						});
					}
				},function(err,results){
					if(err){
						throw new Exception(500, err, res);
					}
					else{
						getSelf().afterGetCollection(req, res,function(){
							var dataArrayInfo = {
								total_entries : parseInt(results.count),
								total_pages: Math.ceil(results.count/pageSize),
								page: parseInt(page+1),
								per_page :parseInt(pageSize)
							}
							res.json(200,[dataArrayInfo,req.recordCollection]);
						});
					}
				});
			});
		},
		delete:function(req,res){
			getSelf().beforeDelete(req, res, function(){
				if(typeof req.record._doc.state != "undefined"){
					req.record._doc.state = "Deleted";

					req.record.save(function(err, result){
						if(err){
							throw new Exception(500, err, res);
						}
						else{
							getSelf().afterDelete(req, res);
							res.send(204);
						}
					});
				}else{
					req.record.remove(function(err){
						if(err){
							throw new Exception(500, err, res);
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
			getSelf().beforeUpdate(req, res, function(){
				for(var i in req.body){
					if( i!="_id" && i != "_metadata")
					{
						req.record[i] = req.body[i];
					}
				}
				req.record.save(function(err){
					if(err){
						throw new Exception(500, err, res);
					}
					else{
						req.recordNew = req.record;
						getSelf().afterUpdate(req, res);
						res.send(204);
					}
				})
			});
		},
		processChangeLog:function(req,action){
			var updateLog = {
				id:req.user.id,
				original:{},
				current:{},
				action:action
			};
			for(var i in req.body){
				if(_.isDate(req.record[i])){
					req.body[i] = new Date(req.body[i]);
				}

				if( !_.isArray(req.body[i]) &&					
					i!="_metadata" ){					
					if( req.record[i]==null|| !_.isEqual(req.record[i].toString(), req.body[i].toString()) ){
						updateLog.original[i] = req.record[i];
						updateLog.current[i] = req.body[i];
					}

				}
			}
			if(!_.isEmpty(updateLog.original)){
				req.record._metadata.updates.push(updateLog);
			}
		}
	});

	var getSelf = function(){
		return app.getController(name);
	}

	return controller;
};
