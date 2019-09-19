(function(zephyr, $, undefined) {

		zephyr.lightsystem	= zephyr.lightsystem || function(){};
		
		var lensflareLight 	= {};
		var camera 			= {};
		var position		= new THREE.Vector3(0, 0, 150);
		
		zephyr.lightsystem.constructor = zephyr.lightsystem;
	
		zephyr.lightsystem.prototype.createBasicLighting = function(){
			
			var spotLight = new THREE.SpotLight(0xfffafa);

			spotLight.position.set(-200, 1000, 1000);
			spotLight.castShadow = true;
			spotLight.shadowMapWidth = 4096;
			spotLight.shadowMapHeight = 4096;
			spotLight.shadowCameraNear = 500;
			spotLight.shadowCameraFar = 4000;
			spotLight.shadowCameraFov = 30;
			spotLight.intensity = 1;

			zephyr.system.getScene().add(spotLight);
			
			var ambientLight = new THREE.AmbientLight(0x222222);
			zephyr.system.getScene().add(ambientLight);			
		}

		zephyr.lightsystem.prototype.createLensflare = function(h, s, v, x, y, z, flareTextures, object){
			
			camera = object;
			
			lensflareLight = new THREE.PointLight(0xfffafa, 0.05);
			lensflareLight.position.set( x, y, z );
			zephyr.system.getScene().add(lensflareLight);
			
			var color = new THREE.Color();
			color.setHSL(h, s, v);
			
			lensflareLight.color = color;
			
			var flareColor = new THREE.Color( 0xfffafa );
			flareColor.copy(lensflareLight.color);
			
			var lensFlare = new THREE.LensFlare( flareTextures[0], 75, 0.0, THREE.AdditiveBlending, flareColor);
			
			lensFlare.add( flareTextures[1], 256, 0.0, THREE.AdditiveBlending );
			lensFlare.add( flareTextures[1], 256, 0.0, THREE.AdditiveBlending );
			lensFlare.add( flareTextures[1], 256, 0.0, THREE.AdditiveBlending );

			lensFlare.add( flareTextures[2], 60, 0.6, THREE.AdditiveBlending );
			lensFlare.add( flareTextures[2], 70, 0.7, THREE.AdditiveBlending );
			lensFlare.add( flareTextures[2], 120, 0.9, THREE.AdditiveBlending );
			lensFlare.add( flareTextures[2], 70, 1.0, THREE.AdditiveBlending );

			lensFlare.customUpdateCallback = lensFlareUpdateCallback;
			lensFlare.position = lensflareLight.position;

			zephyr.system.getScene().add(lensFlare);
		}
		
		function lensFlareUpdateCallback( object ) {
			
			lensflareLight.position.x -= position.x - camera.position.x;
			lensflareLight.position.y -= position.y - camera.position.y;
			lensflareLight.position.z -= position.z - camera.position.z;
			
			position.x = camera.position.x;
			position.y = camera.position.y;
			position.z = camera.position.z;

			var fl = object.lensFlares.length;
			var vecX = -object.positionScreen.x * 2;
			var vecY = -object.positionScreen.y * 2;

			for(var f = 0; f < fl; f++ ) {

				   var flare = object.lensFlares[ f ];

				   flare.x = object.positionScreen.x + vecX * flare.distance;
				   flare.y = object.positionScreen.y + vecY * flare.distance;

				   flare.rotation = 0;
			}

			object.lensFlares[ 2 ].y += 0.025;
			object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + 45 * Math.PI / 180;
		}			

}(window.zephyr = window.zephyr || {}, jQuery));