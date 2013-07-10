
angular.module('dragging', ['mouseCapture', ] )

//
// Service used to help with dragging and clicking on elements.
//
.factory('dragging', function ($rootScope, mouseCapture) {

	//
	// Threshold for dragging.
	// When the mouse moves by at least this amount dragging starts.
	//
	var threshold = 5; //todo: make this an attr option.

	return {


		//
		// Called by users of the service to register a mousedown event and start dragging.
		// Acquires the 'mouse capture' until the mouseup event.
		//
  		startDrag: function (evt, config) {

  			var draggingElement = $(event.target);
  			var draggingElementOffset = draggingElement.offset();
  			var startOffsetX = evt.clientX - draggingElementOffset.left;
  			var startOffsetY = evt.clientY - draggingElementOffset.top;
  			var parentElement = draggingElement.closest('.draggable-container') || draggingElement.parent();
  			var parentOffset = parentElement.offset();

  			var dragging = false;
			var x = evt.clientX;
			var y = evt.clientY;

			//
			// Handler for mousemove events while the mouse is 'captured'.
			//
	  		var mouseMove = function (evt) {

				if (!dragging) {
					if (evt.clientX - x > threshold ||
						evt.clientY - y > threshold)
					{
						dragging = true;

						if (config.dragStarted) {
							var relativeX = evt.clientX - parentOffset.left;
							var relativeY = evt.clientY - parentOffset.top;
							config.dragStarted(relativeX, relativeY, evt, startOffsetX, startOffsetY);
						}
					}
				}
				else {
					if (config.dragging) {
						var deltaX = evt.clientX - x;
						var deltaY = evt.clientY - y;
						var relativeX = evt.clientX - parentOffset.left;
						var relativeY = evt.clientY - parentOffset.top;
						config.dragging(deltaX, deltaY, relativeX, relativeY, evt, startOffsetX, startOffsetY);
					}

					x = evt.clientX;
					y = evt.clientY;
				}
	  		};

	  		//
	  		// Handler for when mouse capture is released.
	  		//
	  		var released = function() {

	  			if (dragging) {
  					if (config.dragEnded) {
  						config.dragEnded();
  					}
	  			}
	  			else {
  					if (config.clicked) {
  						config.clicked();
  					}
	  			}
	  		};

			//
			// Handler for mouseup event while the mouse is 'captured'.
			// Mouseup releases the mouse capture.
			//
	  		var mouseUp = function (evt) {

	  			mouseCapture.release();

	  			evt.stopPropagation();
	  			evt.preventDefault();
	  		};

	  		//
	  		// Acquire the mouse capture and start handling mouse events.
	  		//
			mouseCapture.acquire(evt, {
				mouseMove: mouseMove,
				mouseUp: mouseUp,
				released: released,
			});

	  		evt.stopPropagation();
	  		evt.preventDefault();
  		},

	};

})

;

