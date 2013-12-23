/**
 * Openbiz Default Controller class,
 * it doesn't do anything, just maintenance a class hierarchy
 * @class Controller
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