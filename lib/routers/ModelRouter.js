/**
 * @class ModelRouter
 * @memberof openbiz.routers
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
module.exports = require("../objects/Controller").extend({

    /**
     *  Generate default routes for standard data modal
     *  @static
     *  @memberof openbiz.routers.ModelRouter
     *  @param {string} routePrefix - the route name of this resource
     *  @param {openbiz.controllers.ModelController} modelController - the controller which map this route to
     *  @param {string} [permission] - the permission which default to protect this resource
     *  @return {object} Route rules object
     *  @example
     *  //inside a module router e.g. /cubi/routes/account.js
     *  var routes = openbiz.ModelRouter.getDefaultRoutes('/accounts', openbiz.getController(cubi.account.AccountCountroller), 'cubi-account-manage');
     *  module.exports = routes;
     *  // routes entity will looks like below:
     *  // {
     *  //         "post /accounts" 		: [ openbiz.ensurePermission("cubi-account-manage"),
     *  //                                     openbiz.getController("cubi.account.AccountController").create],
     *  //
     *  //         "get /accounts/:id"		: [ openbiz.ensurePermission("cubi-account-manage"),
     *  //                                     openbiz.getController("cubi.account.AccountController").ensureExists,
     *  //                                     openbiz.getController("cubi.account.AccountController").findById],
     *  //
     *  //         "put /accounts/:id"		: [ openbiz.ensurePermission("cubi-account-manage"),
     *  //                                     openbiz.getController("cubi.account.AccountController").ensureExists,
     *  //                                     openbiz.getController("cubi.account.AccountController").update],
     *  //
     *  //         "delete /accounts/:id"	: [ openbiz.ensurePermission("cubi-account-manage"),
     *  //                                     openbiz.getController("cubi.account.AccountController").ensureExists,
     *  //                                     openbiz.getController("cubi.account.AccountController").delete],
     *  // }
     */
	getDefaultRoutes:function(routePrefix, modelController, permission){
		var routes = {};
        /** if the given controller is not an instance of openbiz ModelController we will not generate it */
        if(modelController instanceof openbiz.ModelController){
            routes["post "+routePrefix]             = [modelController.create];
            routes["get "+routePrefix+"/:id"]       = [modelController.exsureExists, modelController.create];
            routes["put "+routePrefix+"/:id"]       = [modelController.exsureExists, modelController.create];
            routes["delete "+routePrefix+"/:id"]    = [modelController.exsureExists, modelController.create];

            /** if preset a permission , then unshift a middle-ware to all routes */
            if(typeof permission != 'undefined')
            {
                var permissionMiddleware = openbiz.ensurePermission(permission);
                for(var route in routes)
                {
                    routes[route].unshift(permissionMiddleware);
                }
            }
        }
		return routes;
	},
	getDefaultRoutesForSubDoc:function(subdoc){

	}
});