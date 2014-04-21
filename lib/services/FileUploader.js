"use strict";

module.exports = function(options){
	var defaultOptions = {
		app : null,
		maxFileSize:5000000,
		acceptFileTypes:"jpeg|jpg|png"
	}
	return {
		getUploadedFiles:function(req,res,next){

		},
		uploadFiles:function(req,res,next){

		},
		deleteUploadedFiles:function(req,res,next){

		}
	}

}