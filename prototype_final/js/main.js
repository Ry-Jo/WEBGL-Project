( function(zephyr, $, undefined) {
	
		zephyr.system = zephyr.system  || {};

		var camera;
		var scene;
		var renderer;
		var controls;
		var sky;
		var lightsystem;
		var ui;
		var loader;
		var utils;
		
		var time = Date.now();

		var intersect_objects = [];
		
		// starting point						
		zephyr.system.runEngine = function() {

			// init zephyr
			init();
			// setup scene
			createScene();
			// render
			animate();
		};

		// all zephyr-objetcs like the camera or scene are managend in main.js
		// and accessible over the following "public" methods 
		zephyr.system.getIntersectObjects = function() {
			return intersect_objects;
		}
		
		zephyr.system.getScene = function(){
			return scene;
		}
		
		zephyr.system.getControls = function(){
			return controls
		}
		
		zephyr.system.getUI = function(){
			return ui;
		}
		
		zephyr.system.getLoader = function(){
			return loader;
		}
		
		function init() {
			
			// check, if browser supports WebGL			
			utils = new zephyr.utils();
			utils.checkWebGlContext();
			
			// create new scene
			scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2(zephyr.config.graphics.fogcolor, zephyr.config.graphics.fogdensity);

			$container = $("#container");

			// create WebGL Renderer with some special config
			renderer = new THREE.WebGLRenderer({
				antialias : zephyr.config.graphics.antialias,
				alpha : true
			});
			renderer.setSize(zephyr.config.width, zephyr.config.height);
			renderer.shadowMapEnabled = zephyr.config.graphics.shadowmapenabled;
			renderer.shadowMapSoft = zephyr.config.graphics.shadowmapsoft;
			renderer.domElement.style.backgroundColor = zephyr.config.graphics.backcolor;
			renderer.autoClear = false;
			renderer.setClearColor(scene.fog.color, 1);
			
			// append renderer to DOM
			$container.append(renderer.domElement);
			
			// FPS-indicator
			stats = new Stats();
			$container.append(stats.domElement);
			
			// create Camera
			camera 		= new THREE.PerspectiveCamera(zephyr.config.camera.view_angle, zephyr.config.camera.aspect, zephyr.config.camera.near, zephyr.config.camera.far);
			
			// create custom zephyr objects
			controls 	= new zephyr.controls(camera);	
			sky 		= new zephyr.sky();
			lightsystem = new zephyr.lightsystem();
			ui			= new zephyr.ui();
			loader		= new zephyr.loader();
		}

		function createScene() {
		
			// load models asynchronously
			// the callback-functions will add the models to scene.
			// models are designed in Blender and exported with three.js plugin
			var jsonLoader = new THREE.JSONLoader();
			jsonLoader.load("models/railing.js", addRailingToScene);
			jsonLoader.load("models/information_desk.js", addInformationDesk);
			jsonLoader.load("models/monitor.js", addMonitor);
			jsonLoader.load("models/mailbox_fin.js", addMailbox);

			// add controls
			scene.add(controls.getObject());
		
			// load diffuseMap
			var plane_diffuseMap = THREE.ImageUtils.loadTexture('textures/wood_floor_d.jpg');
			plane_diffuseMap.wrapT = THREE.RepeatWrapping;
			plane_diffuseMap.wrapS = THREE.RepeatWrapping;
			plane_diffuseMap.repeat.set(8, 8);
			plane_diffuseMap.anisotropy = renderer.getMaxAnisotropy();

			// load bumbMap
			var plane_bumpMap = THREE.ImageUtils.loadTexture('textures/wood_floor_b.jpg');
			plane_bumpMap.wrapT = THREE.RepeatWrapping;
			plane_bumpMap.wrapS = THREE.RepeatWrapping;
			plane_bumpMap.repeat.set(8, 8);
			plane_bumpMap.anisotropy = renderer.getMaxAnisotropy();
			
			// load specularMap
			var plane_specMap = THREE.ImageUtils.loadTexture('textures/wood_floor_s.jpg');
			plane_specMap.wrapT = THREE.RepeatWrapping;
			plane_specMap.wrapS = THREE.RepeatWrapping;
			plane_specMap.repeat.set(8, 8);
			plane_specMap.anisotropy = renderer.getMaxAnisotropy();

			// create mesh
			var plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 10, 10), new THREE.MeshPhongMaterial({
				map : plane_diffuseMap,
				bumpMap : plane_bumpMap,
				specularMap: plane_specMap,
				bumpScale : 0.5,
				perPixel : true,
				shading : THREE.SmoothShading,
				ambient : 0x333333,
				specular : 0xffffff,
				shininess : 50
			}));

			plane.rotation.x = -Math.PI / 2;
			plane.position.y = -20;
			plane.receiveShadow = true;

			scene.add(plane);
			
			// create basic lighting
			lightsystem.createBasicLighting();
			
			// load textures for lensflares
			var flareTextures = [];
			flareTextures.push(THREE.ImageUtils.loadTexture( "textures/lensflare1.png" ));
			flareTextures.push(THREE.ImageUtils.loadTexture( "textures/lensflare2.png" ));
			flareTextures.push(THREE.ImageUtils.loadTexture( "textures/lensflare3.png" ));

			// create lensflares
			lightsystem.createLensflare(0.995, 0.5, 0.9, -1350, 1400, 4000, flareTextures, controls.getObject());
			
			// create sky
			sky.create();
			
			// create ui elements like interface
			ui.create();
			
			createLevelBorders();
			
			loader.finish();
		}
		
		function addRailingToScene(geometry, material){
			
			var wall_1 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
			wall_1.scale.set(1, 1, 1);
			wall_1.castShadow = true;
			wall_1.position.set(-143,-20,145);
			
			var wall_2 = wall_1.clone();
			wall_2.position.set(-143,-20,-145);
			
			var wall_3 = wall_1.clone();
			wall_3.rotation.y = 90 * Math.PI / 180;
			wall_3.position.set(145,-20, 143);
			
			var wall_4 = wall_1.clone();
			wall_4.rotation.y = -(90 * Math.PI / 180);
			wall_4.position.set(-145,-20, -143);
			
			scene.add(wall_1);
			scene.add(wall_2);
			scene.add(wall_3);
			scene.add(wall_4);
			
			loader.finish();
		}
		
		function addInformationDesk(geometry, material){
			
			var desk = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
			desk.scale.set(15, 15, 15);
			desk.castShadow = true;
			desk.position.set(0,-20,0);
			intersect_objects.push(desk);	
			
			scene.add(desk);
			
			loader.finish();
		}
		
		function addMailbox(geometry, material){
			
			var mb1 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
			mb1.scale.set(15, 15, 15);
			mb1.castShadow = true;
			mb1.position.set(0,-20,0);
			intersect_objects.push(mb1);	
			
			scene.add(mb1);
			
			loader.finish();
		}
		
		
		
		function addMonitor(geometry, material){
			
			var monitor_1 = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
			monitor_1.scale.set(10, 10, 10);
			monitor_1.rotation.y = 45 * Math.PI / 180;
			monitor_1.position.set(-50, 3, 18);				
			monitor_1.userData.interactive = true;
			monitor_1.name = "monitor_1";
			intersect_objects.push(monitor_1);
			
			var monitor_2 = monitor_1.clone();
			monitor_2.rotation.y = 135 * Math.PI / 180;
			monitor_2.position.set(50, 3, 18);		
			monitor_2.userData.interactive = true;
			monitor_2.name = "monitor_2";
			intersect_objects.push(monitor_2);	
			
			var monitor_3 = monitor_1.clone();
			monitor_3.rotation.y = 60 * Math.PI / 180;
			monitor_3.position.set(-25, 3, 50);	
			monitor_3.userData.interactive = true;
			monitor_3.name = "monitor_3";
			intersect_objects.push(monitor_3);			
			
			var monitor_4 = monitor_1.clone();
			monitor_4.rotation.y = 120 * Math.PI / 180;
			monitor_4.position.set(25, 3, 50);		
			monitor_4.userData.interactive = true;
			monitor_4.name = "monitor_4";
			intersect_objects.push(monitor_4);		
			
			scene.add(monitor_1);
			scene.add(monitor_2);
			scene.add(monitor_3);
			scene.add(monitor_4);
			
			loader.finish();
		}
		
		
		function createLevelBorders(){
			
			var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 200, 300), new THREE.MeshLambertMaterial({
				side: THREE.BackSide
			}));	
			
			cube.visible = false;
			scene.add(cube);
			intersect_objects.push(cube);
			
			loader.finish();
		}

		function animate() {

			// animation-loop
			requestAnimFrame(animate);

			render();
		}

		function render() {

			// updating elements
			stats.update();
			
			sky.render(renderer);

			controls.update(Date.now() - time);

			renderer.render(scene, camera);

			time = Date.now();
		}

		function resizeWindow() {

			// handle window resizing
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		}


		$(window).resize(resizeWindow);

	}(window.zephyr = window.zephyr || {}, jQuery)); 