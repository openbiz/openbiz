/**
 * Enforce current request to redriect to HTTPS mode
 * the parameter is HTTPS port number
 *
 * @memberof openbiz.policies
 * @method
 * @param
 * @return {function}  returns default openbiz middle-ware
 *                             that will ensure user has specified permission
 * @example
 * // for example when you manually define your routing rules,
 * // you may want this route be protected by a specified permission
 *
 * app.all('/',openbiz.enforceSSL);
 *
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */

'use strict';
module.exports =  function(req, res, next){
	if (req.protocol == 'https'){
		 next();
	}
	else{
		if(req.app.get('enforceSSL') == true)
		{
			var host = req.get('host');
			var hostArray = host.split(":");
			var httpsURL =  'https://' + hostArray[0] +':'+ req.app.get("sslPort")  + req.url;
			var httpMothod = req.method === '' ? "GET" : req.method;
			if(httpMothod == "GET"){
				res.redirect(301,httpsURL);
			}
			else{
				res.json(406,{error:"This request requires to use 'https'"});
			}
		}else{
			next();
		}
	}
};