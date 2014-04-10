/**
 * Ensure data state middle-ware generator
 * it can based on given state parameter to generate a route middle ware.
 * Sometime the senario maybe like a record has been locked by some condition.
 * e.g. the record which is ready been approved, so user should not be able to write it. 
 * in that case this record's state should be changed to writable:false and deletable:false
 *
 * @memberof openbiz.policies
 * @method
 * @param {string} state - permission name to check
 * @return {function}  returns default openbiz middle-ware
 *                             that will ensure user has specified permission
 * @example
 * // for example when you manually define your routing rules,
 * // you may want this route be protected by a specified permission
 * "put /accounts" 			: [ openbiz.ensureDataState("writable"),
 *                              openbiz.getController("cubi.account.AccountController").create],
 *
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
var ensureDataState=[];
module.exports = function(stateName)
{
	return ensureDataState[stateName] || ( ensureDataState[stateName] = function(req, res, next)
	{
		if(typeof req.record._metadata.state == "undefined"){
			next();
		}else{
			if(req.record._metadata.state[stateName]===false){
				 res.json({
							error:{
								code:403,
								message: "This record is not "+stateName
							}
						},403);

			}else{
				next();
			}
		}
	});
}