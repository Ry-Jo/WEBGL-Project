( function(zephyr, $, undefined) {

		zephyr.ui = function() {
					
			// FF fix
			$('body').css('MozUserSelect','none');
			
			// Stats style
			$('#stats').css('position','absolute');
			$('#stats').css('top','0px');
			$('#stats').css('zIndex','100');
		};
		
		zephyr.ui.constructor = zephyr.ui;

		zephyr.ui.prototype.showModal = function(id) {
			$(id).modal();
		}

		zephyr.ui.prototype.showInteractionLabel = function(text) {
			$("#interact-label").text(text);
			$("#interact-label").show();
		}

		zephyr.ui.prototype.hideInteractionLabel = function() {
			$("#interact-label").hide();
		}

		zephyr.ui.prototype.modalActive = function() {
			return $(".modal").hasClass('in');
		}

		zephyr.ui.prototype.setEventListener = function(selektor, event, handler) {

			$(selektor).on(event, handler);
		}

		zephyr.ui.prototype.removeEventListener = function(selektor, event, handler) {
			$(selektor).off(event, handler);
		}

		zephyr.ui.prototype.create = function() {

			// event-listeners to change the controls, when opening or closing
			// a modal window
			$(".modal").on('hide', zephyr.system.getControls().lockPointer);
			$(".modal").on('show', zephyr.system.getControls().releasePointer);
		}
		zephyr.ui.prototype.toggleFPS = function(){
			
			$("#stats").toggle();
		}		
	}(window.zephyr = window.zephyr || {}, jQuery));  