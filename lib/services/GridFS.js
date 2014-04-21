"use strict";
var _ = require('underscore'),
	fs = require('fs'),
	Grid = require('gridfs-stream');

module.exports = {
	storageReader:function(req,res){
        var filename = req.params[0];
		var readstream = req.app.openbiz.gfs.createReadStream({filename:filename});
		readstream.pipe(res);
	}
}