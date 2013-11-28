
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

  			var draggingElement = $(evt.target);
  			var draggingElementOffset = draggingElement.offset();
  			var startOffsetX = evt.pageX - draggingElementOffset.left;
  			var startOffsetY = evt.pageY - draggingElementOffset.top;
  			var parentElement = draggingElement.closest('.draggable-container') || draggingElement.parent();
  			var parentOffset = parentElement.offset();

  			var dragging = false;
			var x = evt.pageX;
			var y = evt.pageY;

			//
			// Handler for mousemove events while the mouse is 'captured'.
			//
	  		var mouseMove = function (evt) {

				if (!dragging) {
					if (evt.pageX - x > threshold ||
						evt.pageY - y > threshold)
					{
						dragging = true;

						if (config.dragStarted) {
							var relativeX = evt.pageX - parentOffset.left;
							var relativeY = evt.pageY - parentOffset.top;
							config.dragStarted(relativeX, relativeY, evt, startOffsetX, startOffsetY);
						}
					}
				}
				else {
					if (config.dragging) {
						var deltaX = evt.pageX - x;
						var deltaY = evt.pageY - y;
						var relativeX = evt.pageX - parentOffset.left;
						var relativeY = evt.pageY - parentOffset.top;
						config.dragging(deltaX, deltaY, relativeX, relativeY, evt, startOffsetX, startOffsetY);
					}

					x = evt.pageX;
					y = evt.pageY;
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

