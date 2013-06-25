
angular.module('flowChart', ['dragging'] )

.directive('flowChart', function(dragging) {
  return {
  	restrict: 'E',
  	templateUrl: "flowchart/flowchart_template.html",
  	replace: true,
  	scope: {
  		chart: "=",
  	},

  	link: function($scope, $element, $attrs) {

  		//
  		// Init data-model variables.
  		//
  		$scope.draggingInputConnection = false;

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

				dragging: function (deltaX, deltaY) {

					//console.log("dragging: " + deltaX + ", " + deltaY);

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
		// Handle mousedown on an input connector.
		//
		$scope.connectorMouseDown = function (evt, node, connector, connectorIndex, inputConnector) {

			//
			// Initiate dragging out of a connection.
			//
			dragging.startDrag(evt, {

				//
				// Called when the mouse has moved greater than the threshold distance
				// and dragging has commenced.
				//
				dragStarted: function (x, y) {
					if (inputConnector) {
						$scope.draggingInputConnection = true;
					}
					else {
						$scope.draggingOutputConnection = true;
					}
					$scope.dragPoint1 = computeConnectorPos(node, connectorIndex, inputConnector);
					$scope.dragPoint2 = {
						x: x,
						y: y
					};
					computeDraggingTangent();
				},

				//
				// Called on mousemove while dragging out a connection.
				//
				dragging: function (deltaX, deltaY, x, y) {

					$scope.dragPoint1 = computeConnectorPos(node, connectorIndex, inputConnector);
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
					$scope.draggingInputConnection = false;
					$scope.draggingOutputConnection = false;
					delete $scope.draggingConnection;
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

