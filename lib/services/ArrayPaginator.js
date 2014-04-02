"use strict";
/**
 * @class ArrayPaginator
 * @classdesc
 * The server side adapter for Backbone.Paginator class
 * supports URL get parameters as below 
 * 	pre_page - how many items per page
 * 	page  - page number
 * 	sort  - sort by which column
 *  order - 1 for asc , -1 for desc
 *  callback - supports for JSONP
 *  query - query keywords
 * 
 **/

module.exports = function(dataArray, params){
	if(params.query)
	{
		dataArray = dataArray.filter(function(elem){			
			if(JSON.stringify(elem).indexOf(params.query) != -1){
				return elem;	
			}			
		});
	}

	//process sorting the array	
	if(params.sort_by){
		dataArray.sort(function(a, b){
			var keyA ,keyB;			
			var attr = params.sort_by;    
		    var attrArray = attr.split('.');	    
		    keyA = a;
		    keyB = b;
		    for(var i =0; i<attrArray.length; i++){
		      var indexName = attrArray[i];
		      keyA = keyA[indexName];
		      keyB = keyB[indexName];
		    }

		    if(keyA < keyB) return -1;
		    if(keyA > keyB) return 1;
		    return 0;
		});
	}
	//process order 
	if(params.order=='desc'){
		dataArray.reverse();
	}
	//process slice	
	var pageId = parseInt(params.page?params.page:1);
	var pageSize = parseInt(params.per_page?params.per_page:10);
	var startPos = parseInt((pageId-1) * pageSize);
	var endPos = parseInt(startPos + pageSize) ;
	var dataPagedArray = dataArray.slice(startPos, endPos);	
	var dataArrayInfo = {
		total_entries : parseInt(dataArray.length),
		total_pages: Math.ceil(dataArray.length/pageSize),
		page: parseInt(pageId),
		per_page :parseInt(pageSize)
	}
	return [dataArrayInfo,dataPagedArray]
}