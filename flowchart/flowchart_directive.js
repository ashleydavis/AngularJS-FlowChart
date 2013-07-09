//
// Flowchart module.
//
angular.module('flowChart', ['dragging'] )

//
// Flowchart directive.
//
.directive('flowChart', function(dragging) {
  return {
  	restrict: 'E',
  	templateUrl: "flowchart/flowchart_template.html",
  	replace: true,
  	scope: {
  		chart: "=",
  	},

  	//
  	// Angular link function, called to attach the directive's element to the its scope (its data-model).
  	//
  	link: function($scope, $element, $attrs) {

  		//
  		// Init data-model variables.
  		//
  		$scope.draggingConnection = false;
  		$scope.connectorSize = 10;

  		//
  		// Reference to the connector that the mouse is currently over.
  		//
  		var mouseOverConnector = null;

  		//
  		// The class for connectors.
  		//
  		var connectorClass = 'connector';

  		//
  		// Find the element that is the parent connector of the particular element.
  		//
  		var findParentConnector = function (element) {

  			//
  			// Reached the root.
  			//
  			if (element.length == 0)
  			{
  				return null;
  			}

  			// 
  			// Check if the element has the class that identifies it as a connector.
  			//
			if (hasClassSVG(element, connectorClass)) {
				//
				// Found the connector element.
				//
  				return element;
  			}

  			//
  			// Recursively search parent elements.
  			//
  			return findParentConnector(element.parent());
  		};

  		//
  		// Called for each mouse move on the svg element.
  		//
  		$scope.mouseMove = function (evt) {

  			//
  			// Need to figure out if the mouse is currently over a connector.
  			//
  			var curMouseOverConnector = null;

  			//
  			// Retreive the element the mouse is currently over.
  			//
  			var mouseOverElement = document.elementFromPoint(evt.clientX, evt.clientY);

  			//
  			// Find the parent element, if any, that is a connector.
  			//
			var hoverElement = findParentConnector($(mouseOverElement));
			if (hoverElement) {
				var connectorScope = hoverElement.scope();
				curMouseOverConnector = connectorScope.connector;
			}

			if (curMouseOverConnector != mouseOverConnector) {
				if (mouseOverConnector) {
					// Clear the previous 'mouse over' connector.
					mouseOverConnector.isMouseOver = false;
				}

				// Mark the connector as 'mouse over' so that we can change its appearance from the view.
				if (curMouseOverConnector) {
					curMouseOverConnector.isMouseOver = true; 
				}

				mouseOverConnector = curMouseOverConnector;
			}

  		};

  		//
  		// Compute the position of a connector relative to its node.
  		//
  		$scope.computeLocalInputConnectorX = function (connectorIndex) {
			return 80;
		};

  		$scope.computeLocalOutputConnectorX = function (connectorIndex) {
			return 280;
		};

  		$scope.computeLocalConnectorY = function (connectorIndex) {
			return 100 + (connectorIndex * 36.5);
		};

  		//
  		// Compute the position of a connector in the graph.
  		//
  		var computeConnectorPos = function (node, connectorIndex, inputConnector) {
  			return {
  				x: node.x + 
  					(inputConnector ? 
  						$scope.computeLocalInputConnectorX(connectorIndex) :
  						$scope.computeLocalOutputConnectorX(connectorIndex)),
  				y: node.y + $scope.computeLocalConnectorY(connectorIndex),
  			};
  		};

		$scope.nodeMouseDown = function (evt, nodeIndex) {

			var nodes = $scope.chart.nodes;
			var node = nodes[nodeIndex];

			// Move node to the end of the list so it is rendered after all the other.
			// This is the way Z-order is done in SVG.

			nodes.splice(nodeIndex, 1);
			nodes.push(node);			

			dragging.startDrag(evt, {

				dragging: function (deltaX, deltaY, x, y) {

					node.x += deltaX;
					node.y += deltaY;
				},

				dragStarted: function () {
					console.log("Drag started...");
				},

				dragEnded: function () {
					console.log("Drag ended...");
				},

				clicked: function () {
					console.log("Clicked ...");
				},

			});

		};

		//
		// Compute the tangent for the bezier curve.
		//
		var computeDraggingTangent = function () {

			var tangentOffset = ($scope.dragPoint2.x - $scope.dragPoint1.x) / 2;
			$scope.dragTangent1 = {
				x: $scope.dragPoint1.x + tangentOffset,
				y: $scope.dragPoint1.y
			};
			$scope.dragTangent2 = {
				x: $scope.dragPoint2.x - tangentOffset,
				y: $scope.dragPoint2.y
			};
		};

		//
		// Hit test and retreive node and connector that was hit at the specified coordinates.
		// isInputConnector specifies whether you want input connectors or output connectors.
		//
		var hitTestForConnector = function (x, y, isInputConnector) {

			// http://stackoverflow.com/questions/2174640/hit-testing-svg-shapes


			var el = document.elementFromPoint(x, y);


		};

		//
		// Handle mousedown on an input connector.
		//
		$scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {

			console.log("dragging: " + evt.clientX + ", " + evt.clientY);//fio:


			//
			// Initiate dragging out of a connection.
			//
			dragging.startDrag(evt, {

				//
				// Called when the mouse has moved greater than the threshold distance
				// and dragging has commenced.
				//
				dragStarted: function (x, y) {

					$scope.draggingConnection = true;
					$scope.dragPoint1 = computeConnectorPos(node, connectorIndex, isInputConnector);
					$scope.dragPoint2 = {
						x: x,
						y: y
					};
					computeDraggingTangent();
				},

				//
				// Called on mousemove while dragging out a connection.
				//
				dragging: function (deltaX, deltaY, x, y, evt) {
					$scope.dragPoint1 = computeConnectorPos(node, connectorIndex, isInputConnector);
					$scope.dragPoint2 = {
						x: x,
						y: y
					};
					computeDraggingTangent();
				},

				//
				// Clean up when dragging has finished.
				//
				dragEnded: function () {
					$scope.draggingConnection = false;
					delete $scope.dragPoint1;
					delete $scope.dragTangent1;
					delete $scope.dragPoint2;
					delete $scope.dragTangent2;
				},

			});
		};

 	},
  };
})
;

