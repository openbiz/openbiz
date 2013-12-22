'use strict';
var ensurePermission={};
module.exports = function(permission)
{	
	return ensurePermission[permission] || ( ensurePermission[permission] = function(req, res, next)
	{
		if(typeof req.user == "undefined")
		{			
			res.json(
			{
				error:{
					code: 403,
					message: "User is not authorized",
				}
			},403);
		}
		else
		{
			//check if user modal has "hasPermission()" method
			if(req.user.hasOwnProperty("hasPermission") && typeof req.user.hasPermission =="Function" )
			{
				//check if any of users roles has this permission
				if(req.user.hasPermission(permission))
				{
					next();
				}
				else
				{
					res.json({
						error:{
							code: 403,
							message: "User is authorized but doesn't has [ "+permission+" ] permission",
						}						
					},403);	
				}				
			}
			else
			{
				//Openbiz couldn't ensure that permission if the "hasPermission()" is not a function
				res.json({
					error:{
						code: 500,
						message: "User model doesn't have \"hasPermission()\" method, Openbiz couldn't ensure permissions." ,
					}						
				},500);
			}
		}
	});
}