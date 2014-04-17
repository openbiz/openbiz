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
var ensureDataACLPermission=[];
module.exports = function(permission)
{
	return ensureDataACLPermission[permission] || ( ensureDataACLPermission[permission] = function(req, res, next)
	{
		if(typeof req.record._metadata == "undefined"){
			next();
			return;
		}
		if(typeof req.record._metadata.ACL == "undefined"){
			next();
		}else{
			if(req.record._metadata.ACL.length > 0){
				var acl = null;
				for(var i in req.record._metadata.ACL){
					var _acl = req.record._metadata.ACL[i];
					if(_acl.id == req.user.id){
						acl = _acl;
						break;
					}
				}
				if(acl != null){
					if(acl.permission == "MANAGE"){
						next();
					}else{
						if(acl.permission == permission && permission == "ACCESS"){
							next();
						}else{
							res.json(
								{
									error:{
										code:402,
										message: "User has no permission"
									}
								},403);
						}
					}
				}else{
					res.json(
						{
							error:{
								code:402,
								message: "User has no permission"
							}
						},403);
				}

			}else{
				next();
			}
		}
	});
}