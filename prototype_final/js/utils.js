( function(zephyr, $, undefined) {

		zephyr.utils = zephyr.utils || function() {};
		
		zephyr.utils.constructor = zephyr.utils;

		// this method creates a canvas element to check 
		// webgl-capability	of the browser
		zephyr.utils.prototype.checkWebGlContext = function() {
			
			$('body').append($('<canvas></canvas>').attr({ 'id' : 'browser-check' }));
			
			var canvas = document.getElementById("browser-check");
			
			var ctx = null;
		   	   	
	   	   	var context;
	   	   	// different browsers, different names...
			var names = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];
			
			$.each(names, function(index, name) { 		
				try {
					if(!context)
						context = canvas.getContext(name);
				} 
				catch (e) {}
			});
			
			if (context == null) {
				alert("Could not initialise WebGL. Please use a suitable Browser");
				window.location.href = "http://get.webgl.org/";
			} 
			
			$('canvas').remove();
		}

	}(window.zephyr = window.zephyr || {}, jQuery));
