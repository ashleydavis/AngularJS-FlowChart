
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
  		$scope.draggingConnection = false;

  		//
  		// Compute the position of a connector relative to its node.
  		//
  		$scope.computeLocalInputConnectorX = function (connectorIndex) {
			return 80;
		};

  		$scope.computeLocalInputConnectorY = function (connectorIndex) {
			return 100 + (connectorIndex * 36.5);
		};

  		//
  		// Compute the position of a connector in the graph.
  		//
  		var computeConnectorPos = function (node, connectorIndex) {
  			return {
  				x: node.x + $scope.computeLocalInputConnectorX(connectorIndex),
  				y: node.y + $scope.computeLocalInputConnectorY(connectorIndex),
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

		$scope.inputConnectorMouseDown = function (evt, node, connector, connectorIndex) {

			dragging.startDrag(evt, {

				dragging: function (deltaX, deltaY, x, y) {

					$scope.dragPoint.x = x;
					$scope.dragPoint.y = y;
				},

				dragStarted: function (x, y) {
					$scope.draggingConnection = true;
					$scope.draggingConnectorPos = computeConnectorPos(node, connectorIndex);
					$scope.dragPoint = {
						x: x,
						y: y
					};
				},

				dragEnded: function () {
					$scope.draggingConnection = false;
					delete $scope.draggingConnection;
					delete $scope.draggingConnectorPos;
					delete $scope.dragPoint;
				},

			});
		};

  	},
  };
})
;

