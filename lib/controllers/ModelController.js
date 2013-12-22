'use strict';
var controller = require("../objects/Controller").extend({
	_model: null,	
	ctor: function(model){
		if(model && typeof model =='Object')
		{
			this._model = model;
		}
		return this;
	},

	//default middle wares
	ensureExists: function(req, res, next)
	{
		
		next();
	},
	
	find: function(req, res)
	{

	},
	findById: function(req, res)
	{
		//just for test
		res.json({random:Math.random()},200);
	},


	//default data create method
	beforeCreate: function(req, res)
	{

	},
	afterCreate: function(req, res)
	{

	},
	create: function(req, res)
	{
		this.beforeCreate(req, res);
		this.afterCreate(req, res);
	},
	

	//default data update method
	beforeUpdate: function(req, res)
	{

	},
	afterUpdate: function(req, res)
	{
		
	},
	update: function(req, res)
	{
		this.beforeUpdate(req, res);
		this.afterUpdate(req, res);
	},
	

	//default data delete method
	beforeDelete: function(req, res)
	{

	},
	afterDelete: function(req, res)
	{
		
	},
	delete: function(req, res)
	{
		this.beforeDelete(req, res);
		this.afterDelete(req, res);
	}
});


module.exports = controller;