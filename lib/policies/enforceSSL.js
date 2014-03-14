/**
 * Enforce current request to redriect to HTTPS mode
 * the parameter is HTTPS port number
 *
 * @memberof openbiz.policies
 * @method
 * @param {integer} httpsPortNumber - HTTPS service port number
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