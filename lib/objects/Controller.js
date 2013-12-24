/**
 * @class Controller
 * @classdesc
 * Openbiz Default Controller class,
 * it doesn't do anything, just maintenance a class hierarchy.
 *
 * All openbiz applications controller is better to inherit and extend this class.
 * But if you don't do that, it's OK, you wouldn't get any error, but you are on your own. ;-)
 *
 * Normally if your controller need to operate a defined data model then you should look at {@link openbiz.controllers.ModelController}.
 * But if you controller only plan to process some special actions other than CURD, like send emails or post some data to other systems via a HTTP API,
 * Then I suggest you based on this class directly.
 *
 * @constructs openbiz.objects.Controller
 * @returns {openbiz.objects.Controller}
 * @author Jixian Wang <jixian@openbiz.me>
 * @version 4.0.0
 * @copyright {@link http://www.openbiz.me|Openbiz LLC}
 * @license {@link http://opensource.org/licenses/BSD-3-Clause|BSD License}
 */
'use strict';
module.exports = require("./Object").extend({
	ctor: function(){	
		return this;
	}
});