// all important configurations are stored in this file
(function(zephyr, $, undefined) {

	zephyr.config 		   				 	= zephyr.config 			|| function(){};	
	zephyr.config.camera   				 	= zephyr.config.camera 		|| function(){};	
	zephyr.config.graphics					= zephyr.config.graphics 	|| function(){};	
	zephyr.config.controls					= zephyr.config.controls 	|| function(){};	
	zephyr.config.loader					= zephyr.config.loader 		|| function(){};	
	
	zephyr.config.width  	 				= window.innerWidth;
	zephyr.config.height 	 				= window.innerHeight;
	
	zephyr.config.camera.view_angle			= 60;
	zephyr.config.camera.aspect	 			= zephyr.config.width / zephyr.config.height;
	zephyr.config.camera.near				= 1;
	zephyr.config.camera.far				= 10000;
		
	zephyr.config.graphics.antialias		= true;
	zephyr.config.graphics.clearalpha		= 0;
	zephyr.config.graphics.shadowmapactive	= true;
	zephyr.config.graphics.shadowmapenabled	= true;
	zephyr.config.graphics.backcolor		= "#E8E8E8";
	zephyr.config.graphics.fogcolor			= 0x000000;
	zephyr.config.graphics.fogdensity		= 0.001;
	
	zephyr.config.controls.lookspeed 		= 0.001;
	zephyr.config.controls.jumpfactor		= 4;
	zephyr.config.controls.jumpspeed 		= 0.20;
	zephyr.config.controls.crouchHeight 	= 0;
	zephyr.config.controls.crouchAnimSpeed	= 0.7;
	zephyr.config.controls.standardHeight	= 10;
	zephyr.config.controls.speed 			= 0.12;
	zephyr.config.controls.crouchspeed 		= 0.06;
	zephyr.config.controls.right			= 3;
	zephyr.config.controls.front			= 0;
	zephyr.config.controls.left				= 1;		
	zephyr.config.controls.back				= 2;
	zephyr.config.controls.right			= 3;
	
	zephyr.config.loader.requests			= 5;
	
	window.requestAnimFrame = (function()
	{
		return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback, element)
				{
					window.setTimeout(callback, 1000 / 60);
				};
	})();
}(window.zephyr = window.zephyr || {}, jQuery));