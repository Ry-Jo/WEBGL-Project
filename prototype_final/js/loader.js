( function(zephyr, $, undefined) {
	
		zephyr.loader = zephyr.loader || function() {};
		
		zephyr.loader.constructor = zephyr.loader;
		
		var requestCounter = 0;
		
		zephyr.loader.prototype.finish = function() {
			requestCounter++;
			checkState();
		}
		
		function checkState(){
			
			var loadingProgress = Math.round(requestCounter * 100 / zephyr.config.loader.requests);
			$("#start-screen .bar").css("width", loadingProgress+"%");
			
			if(requestCounter == zephyr.config.loader.requests){
				$("#loadingStatus .loading-message").hide();
				$("#start-screen .progress").removeClass('active');
				$("#btn-start").show();
			}	
		}
		
		$("#btn-start").click(function() {
			zephyr.system.getControls().lockPointer();
		});
			
	}(window.zephyr = window.zephyr || {}, jQuery));
