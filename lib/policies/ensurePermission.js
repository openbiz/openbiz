/**
 * Ensure permission middle-ware generator
 * it can based on given permission parameter to generate a route middle ware.
 *
 * @memberof openbiz.policies
 * @method
 * @param {string} permission - permission name to check
 * @return {function}  returns default openbiz middle-ware
 *                             that will ensure user has specified permission
 * @example
 * // for example when you manually define your routing rules,
 * // you may want this route be protected by a specified permission
 * "post /accounts" 		: [ openbiz.ensurePermission("cubi-account-manage"),
 *                              openbiz.getController("cubi.account.AccountController").create],
 *
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
var ensurePermission=[];
module.exports = function(permission)
{	
	return ensurePermission[permission] || ( ensurePermission[permission] = function(req, res, next)
	{		
		if(typeof req.user == "undefined")
		{			
			res.json(
			{
				error:{
					code: 401,
					message: "User is not authorized"
				}
			},403);
		}
		else
		{			
			//check if user modal has "hasPermission()" method
			if( typeof req.user.hasPermission =="function" )
			{
				//check if any of users roles has this permission
				if(req.user.hasPermission(permission,req.app.openbiz))
				{
					next();
				}
				else
				{
					res.json({
						error:{
							code: 403,
							message: "User is authorized but doesn't has [ "+permission+" ] permission"
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
						message: "User model doesn't have \"hasPermission()\" method, Openbiz couldn't ensure permissions."
					}						
				},500);
			}
		}
	});
}