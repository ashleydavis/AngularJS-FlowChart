//
// Debug utilities.
//

(function () {

	if (typeof debug !== "undefined") {
		throw new Error("debug object already defined!");
	}

	debug = {};

	//
	// Assert that an object is valid.
	//
	debug.assertObjectValid = function (obj) {

		if (!obj) {
			throw new Exception("Invalid object!");
		}

		if ($.isPlainObject(obj)) {
			throw new Error("Input is not an object! It is a " + typeof(obj));
		}
	};

})();