( function(zephyr, $, undefined) {

		// more information about Pointer-Lock-API
		// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
		
		var controls;

		var pitchObject = new THREE.Object3D();
		var yawObject = new THREE.Object3D();

		var moveForward = false;
		var moveBackward = false;
		var moveLeft = false;
		var moveRight = false;

		var wallCollisionFront = false;
		var wallCollisionLeft = false;
		var wallCollisionBack = false;
		var wallCollisionRight = false;

		var isJump = false;
		var crouch = false;

		var enabled = false;
		var startscreen = true;

		var velocity = new THREE.Vector3();

		zephyr.controls = function(camera) {

			controls = this;

			pitchObject.add(camera);
			yawObject.add(pitchObject);

			// initial position
			yawObject.position.y = 10;
			yawObject.position.z = 110;
		}

		zephyr.controls.constructor = zephyr.controls;

		zephyr.controls.prototype.getObject = function() {
			return yawObject;
		}

		zephyr.controls.prototype.update = function(delta) {

			if (enabled === true) {
				
				checkWallCollision();

				checkInteractiveObjects();

				move(delta);
			}
		}

		zephyr.controls.prototype.getDirection = function() {

			var result = new THREE.Vector3(0, 0, 0);
			var direction = new THREE.Vector3(0, 0, -1);
			var rotation = new THREE.Euler(0, 0, 0, "YXZ");

			// calculate direction of camera
			rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
			result.copy(direction).applyEuler(rotation);

			return result;
		}

		zephyr.controls.prototype.lockPointer = function() {

			var element = document.body;
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();
		}

		zephyr.controls.prototype.releasePointer = function() {
									
			startscreen = false
			// Ask the browser to release the pointer
			document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
			document.exitPointerLock();
		}
		function pointerlockchange() {
			
			var requestedElement = document.body;
			
			if (document.pointerLockElement === requestedElement || document.mozPointerLockElement === requestedElement || document.webkitPointerLockElement === requestedElement) {

				enabled = true;
	
				$('#start-screen').hide();
				$('#crosshair').show();
				$('#crosshair').focus();

			} else {

				enabled = false;
				
				if(startscreen){
					$('#start-screen').show();
				}else{
					startscreen = true;
				}			
				$('#crosshair').hide();
			}
		}

		function pointerlockerror() {
			$('#start-screen').show();
			$('#crosshair').hide();
		}

		function move(delta) {

			delta = delta * 0.1;

			velocity.x += (-velocity.x ) * 0.08 * delta;
			velocity.z += (-velocity.z ) * 0.08 * delta;

			var actualSpeed;

			// if player is creeping, reduce movement speed
			if (crouch)
				actualSpeed = zephyr.config.controls.crouchspeed;
			else
				actualSpeed = zephyr.config.controls.speed;
			
			// prevent too fast movement, when player goes to
			// two directions at the same time
			if ((moveForward && moveLeft) || (moveForward && moveRight))
				actualSpeed = actualSpeed / 1.5;

			if ((moveBackward && moveLeft) || (moveBackward && moveRight))
				actualSpeed = actualSpeed / 1.5;

			// calculate velocity for each direction
			if (moveForward && !wallCollisionFront)
				velocity.z -= actualSpeed * delta;
			if (moveBackward && !wallCollisionBack)
				velocity.z += actualSpeed * delta;

			if (moveLeft && !wallCollisionLeft)
				velocity.x -= actualSpeed * delta;
			if (moveRight && !wallCollisionRight)
				velocity.x += actualSpeed * delta;

			if (crouch === true) {
				if (yawObject.position.y > zephyr.config.controls.crouchHeight)
					yawObject.position.y = yawObject.position.y - zephyr.config.controls.crouchAnimSpeed;
			} else {
				if (yawObject.position.y < zephyr.config.controls.standardHeight)
					yawObject.position.y = yawObject.position.y + zephyr.config.controls.crouchAnimSpeed;
			}

			if (isJump) {
				velocity.y -= zephyr.config.controls.jumpspeed * delta;
			}

			// calculate new position
			yawObject.translateX(velocity.x);
			yawObject.translateY(velocity.y);
			yawObject.translateZ(velocity.z);

			if (isJump && yawObject.position.y < zephyr.config.controls.standardHeight) {

				velocity.y = 0;
				yawObject.position.y = zephyr.config.controls.standardHeight;
				isJump = false;
			}
		}

		function initPointerLock() {

			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			if (havePointerLock) {

				// Hook pointer lock state change events
				document.addEventListener('pointerlockchange', pointerlockchange, false);
				document.addEventListener('mozpointerlockchange', pointerlockchange, false);
				document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

				document.addEventListener('pointerlockerror', pointerlockerror, false);
				document.addEventListener('mozpointerlockerror', pointerlockerror, false);
				document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

			} else {
				console.error('Browser does not seem to support Pointer Lock API');
			}
		}

		function checkWallCollision() {
			
			// front
			computeWallCollision(zephyr.config.controls.front);
			// left
			computeWallCollision(zephyr.config.controls.left);
			// back
			computeWallCollision(zephyr.config.controls.back);
			// right
			computeWallCollision(zephyr.config.controls.right);
		}

		function computeWallCollision(dir) {

			var angle;

			switch(dir) {
				case zephyr.config.controls.front:
					angle = 0;
					break;
				case zephyr.config.controls.left:
					angle = Math.PI / 2;
					break;
				case zephyr.config.controls.back:
					angle = Math.PI;
					break;
				case zephyr.config.controls.right:
					angle = Math.PI * 3 / 2;
					break;
			}

			// get Camera Direction
			var direction = controls.getDirection();

			// apply correct angle
			var axis = new THREE.Vector3(0, 1, 0);
			var matrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
			direction.applyMatrix4(matrix);

			var position = yawObject.position.clone();
			position.y = 0;

			// create raycaster
			var raycaster = new THREE.Raycaster(position, direction);
			// range of collision
			raycaster.far = 25;
			// calculate affected objects
			var intersections = raycaster.intersectObjects(zephyr.system.getIntersectObjects());

			if (intersections.length > 0) {

				switch(dir) {
					case zephyr.config.controls.front:
						wallCollisionFront = true;
						break;
					case zephyr.config.controls.left:
						wallCollisionLeft = true;
						break;
					case zephyr.config.controls.back:
						wallCollisionBack = true;
						break;
					case zephyr.config.controls.right:
						wallCollisionRight = true;
						break;
				}

			} else {
				switch(dir) {
					case zephyr.config.controls.front:
						wallCollisionFront = false;
						break;
					case zephyr.config.controls.left:
						wallCollisionLeft = false;
						break;
					case zephyr.config.controls.back:
						wallCollisionBack = false;
						break;
					case zephyr.config.controls.right:
						wallCollisionRight = false;
						break;
				}
			}

		}

		function interactWithObjects() {

			// get Camera Direction
			var direction = controls.getDirection();
			// create raycaster
			var raycaster = new THREE.Raycaster(yawObject.position, direction);
			// range of interaction
			raycaster.far = 50;
			// calculate affected objects
			var intersects = raycaster.intersectObjects(zephyr.system.getIntersectObjects());

			if (intersects.length > 0) {

				var object = intersects[0].object;
				
				// object has to be interactive
				if (object.userData.interactive === true) {

					// check name of affected object
					switch(object.name) {

						case "monitor_1":
							zephyr.system.getUI().showModal("#monitor_1");
							break;
						case "monitor_2":
							zephyr.system.getUI().showModal("#monitor_2");
							break;
						case "monitor_3":
							zephyr.system.getUI().showModal("#monitor_3");
							break;
						case "monitor_4":
							zephyr.system.getUI().showModal("#monitor_4");
							break;
						default:
							console.warn("CONTROLS: Object " + object.name + " interactive, but no action assigned.");
					}

				} 	
			}

		}

		function checkInteractiveObjects() {

			// get Camera Direction
			var direction = controls.getDirection();
			// create raycaster
			var raycaster = new THREE.Raycaster(yawObject.position, direction);
			// range of interaction
			raycaster.far = 50;
			// calculate affected objects
			var intersects = raycaster.intersectObjects(zephyr.system.getIntersectObjects());

			if (intersects.length > 0) {

				var object = intersects[0].object;

				// object has to be interactive
				if (object.userData.interactive === true) {

					// check name of affected object
					switch(object.name) {

						case "monitor_1":
							zephyr.system.getUI().showInteractionLabel("Web Dynpro");
							break;
						case "monitor_2":
							zephyr.system.getUI().showInteractionLabel("SAPUI5");
							break;
						case "monitor_3":
							zephyr.system.getUI().showInteractionLabel("Floorplan Manager");
							break;
						case "monitor_4":	
							zephyr.system.getUI().showInteractionLabel("CRM WebClient UI");
							break;
						default:
							console.warn("CONTROLS: Object " + object.name + " interactive, but no label assigned.");
							zephyr.system.getUI().hideInteractionLabel();
					}

				} else {
					zephyr.system.getUI().hideInteractionLabel();
				}
			} else {
				zephyr.system.getUI().hideInteractionLabel();
			}
		}

		function onMouseMove(event) {

			// do nothing, if controls are disabled
			if (enabled === false)
				return;

			// capture mouse movement
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			// manipulate rotation of yaw and pitch object,
			// which has an effect on the camera
			yawObject.rotation.y -= movementX * zephyr.config.controls.lookspeed;
			pitchObject.rotation.x -= movementY * zephyr.config.controls.lookspeed;

			// prevent "loop" for vertical axis
			pitchObject.rotation.x = Math.max(-(Math.PI / 2), Math.min((Math.PI / 2), pitchObject.rotation.x));
		}

		function onKeyDown(event) {

			switch ( event.keyCode ) {

				case 38:
				// up
				case 87:
					// w
					moveForward = true;
					break;

				case 37:
				// left
				case 65:
					// a
					moveLeft = true;
					break;

				case 40:
				// down
				case 83:
					// s
					moveBackward = true;
					break;

				case 39:
				// right
				case 68:
					// d
					moveRight = true;
					break;
				case 69:
					/*E*/
					interactWithObjects();
					break;
				case 70:
				/*F*/
					zephyr.system.getUI().toggleFPS();				
				break;
				case 67:
					/*C*/
					if (crouch) {
						crouch = false
					} else {
						crouch = true;
					}
					break;

				case 32:
					// space
					if (!isJump && !crouch) {
						isJump = true;
						velocity.y += zephyr.config.controls.jumpfactor;
					}
					break;

			}
		}

		function onKeyUp(event) {
			switch( event.keyCode ) {

				case 38:
				// up
				case 87:
					// w
					moveForward = false;
					break;

				case 37:
				// left
				case 65:
					// a
					moveLeft = false;
					break;

				case 40:
				// down
				case 83:
					// a
					moveBackward = false;
					break;

				case 39:
				// right
				case 68:
					// d
					moveRight = false;
					break;

			}
		}

		function disableContextMenu(event) {
			event.preventDefault();
		}


		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);

		$(window).load(initPointerLock);	
		$(window).on("contextmenu", disableContextMenu);
		

	}(window.zephyr = window.zephyr || {}, jQuery));
