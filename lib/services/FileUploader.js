"use strict";
var _ = require('underscore'),
	fs = require('fs');

module.exports = function(options){
	options = options || {};

	var defaultOptions = {
		app : null,
		minFileSize:1000,
		maxFileSize:5000000,
		acceptFileTypes:["jpeg","jpg","png"]
	}
	for(var i in defaultOptions){
		if(!options.hasOwnProperty(i)){
			options[i] = defaultOptions[i];
		}
	}

	


	var FileInfo = function (file) {
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.deleteType = 'DELETE';
    };	
	FileInfo.prototype.validate = function () {
        if (options.minFileSize && options.minFileSize > this.size) {
            this.error = 'File is too small';
        } else if (options.maxFileSize && options.maxFileSize < this.size) {
            this.error = 'File is too big';
        } else if (!new RegExp("(\.|\/)("+options.acceptFileTypes.join("|")+")$",'i').test(this.name)) {
            this.error = 'Filetype not allowed';
        }
        return !this.error;
    };
    FileInfo.prototype.safeName = function () {
        this.name = this.name.replace(/^.*(\..*$)/gi, function(str,value){        	
        	return Date.now()+value;
        });
    };
    FileInfo.prototype.initUrls = function (req) {
        if (!this.error) {
        	if(options.app!==null){
				var uploadUrl = options.app.storage.url	+ options.uploadUrl + req.user.account.id+"/" ;
				var uploadPath = options.app.storage.path + options.uploadPath  + req.user.account.id+"/" ;
				var deleteUrl = options.app.appUrl + options.deleteUrl.replace(":accountId",req.user.account.id)  ;
			}			

            var that = this,
                baseUrl = uploadUrl;
            this.url =  baseUrl + encodeURIComponent(this.name);     
            this.deleteUrl =  deleteUrl +  encodeURIComponent(this.name);     
        }
    };



	return {
		checkService:function(req,res,next){
			res.send(200);
		},
		getUploadedFiles:function(req,res,next){

		},
		uploadFiles:function(req,res,next){
			require('connect-multiparty')({ 
				uploadDir: req.app.openbiz.storage.tmpPath 
			})(req,res,function(error){				
				var handler = this,files = [];
				for(var i=0;i<req.files.files.length;i++){
					var file = req.files.files[i];

					var stats = fs.statSync(file.path);
					if (stats.isFile() && file.originalFilename[0] !== '.') {
	                    var fileInfo = new FileInfo({
	                        name: file.originalFilename,
	                        size: stats.size
	                    });
	                    fileInfo.safeName();
	                    fileInfo.initUrls(req);
	                    //todo save file to GridFS
	                    files.push(fileInfo);
	                }
				}
				req.uploadedFiles = {files:files};
				next();
			})
		},
		deleteUploadedFile:function(req,res,next){
			var accountId = req.params.accountId;
			var file = req.params.file;
			var files = [];
			var fileRec = {};
			fileRec[file]=true;
			//todo: delete the real file
			files.push(fileRec);
			req.deleteFiles = {files:files};
			res.send(200,req.deleteFiles);
		}
	}

}