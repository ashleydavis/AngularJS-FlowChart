//
// Flowchart module.
//
angular.module('flowChart', ['dragging'] )

//
// Directive that generates the rendered chart from the data model.
//
.directive('flowChart', function() {
  return {
  	restrict: 'E',
  	templateUrl: "flowchart/flowchart_template.html",
  	replace: true,
  	scope: {
  		chart: "=chart",
  	},

  	//
  	// Controller for the flowchart directive.
  	// Having a separate controller is better for unit testing, otherwise
  	// it is painful to unit test a directive without instantiating the DOM 
  	// (which is possible, just not ideal).
  	//
  	controller: flowchart_directive.FlowChartController,
  };
})

//
// Directive that allows the chart to be edited as json in a textarea.
//
.directive('chartJsonEdit', function () {
	return {
		restrict: 'A',
		scope: {
			viewModel: "="
		},
		link: function (scope, elem, attr) {

			//
			// Serialize the data model as json and update the textarea.
			//
			var updateJson = function () {
				if (scope.viewModel) {
					var json = JSON.stringify(scope.viewModel.data, null, 4);
					$(elem).val(json);
				}
			};

			//
			// First up, set the initial value of the textarea.
			//
			updateJson();

			//
			// Watch for changes in the data model and update the textarea whenever necessary.
			//
			scope.$watch("viewModel.data", updateJson, true);

			//
			// Handle the change event from the textarea and update the data model
			// from the modified json.
			//
			$(elem).bind("input propertychange", function () {
				var json = $(elem).val();
				var dataModel = JSON.parse(json);
				scope.viewModel = new flowchart.ChartViewModel(dataModel);

				scope.$digest();
			});
		}
	}

})
;

//
// A namespace for the flowchart controller.
// This needs to be publically accessible for unit testing.
//
var flowchart_directive = {
};

//
// Controller for the flowchart directive.
// Having a separate controller is better for unit testing, otherwise
// it is painful to unit test a directive without instantiating the DOM 
// (which is possible, just not ideal).
//
flowchart_directive.FlowChartController = function ($scope, dragging, $element) {

	var controller = this;

	//
	// Reference to the document and jQuery, can be overridden for testting.
	//
	this.document = document;

	//
	// Wrap jQuery so it can easily be  mocked for testing.
	//
	this.jQuery = function (element) {
		return $(element);
	}

	//
	// Init data-model variables.
	//
	$scope.draggingConnection = false;
	$scope.connectorSize = 10;
	$scope.dragSelecting = false;
	/* Can use this to test the drag selection rect.
	$scope.dragSelectionRect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	};
	*/

	//
	// Reference to the connection that the mouse is currently over.
	//
	$scope.mouseOverConnection = null;

	//
	// Reference to the connector that the mouse is currently over.
	//
	$scope.mouseOverConnector = null;

	//
	// The class for connections and connectors.
	//
	this.connectionClass = 'connection';
	this.connectorClass = 'connector';

	//
	// Search up the HTML element tree for an element the requested class.
	//
	this.searchUp = function (element, parentClass) {

		//
		// Reached the root.
		//
		if (element == null || element.length == 0) {
			return null;
		}

		// 
		// Check if the element has the class that identifies it as a connector.
		//
		if (hasClassSVG(element, parentClass)) {
			//
			// Found the connector element.
			//
			return element;
		}

		//
		// Recursively search parent elements.
		//
		return this.searchUp(element.parent(), parentClass);
	};

	//
	// Hit test and retreive node and connector that was hit at the specified coordinates.
	//
	this.hitTest = function (clientX, clientY) {

		//
		// Retreive the element the mouse is currently over.
		//
		return this.document.elementFromPoint(clientX, clientY);
	};

	//
	// Hit test and retreive node and connector that was hit at the specified coordinates.
	//
	this.checkForHit = function (mouseOverElement, whichClass) {

		//
		// Find the parent element, if any, that is a connector.
		//
		var hoverElement = this.searchUp(this.jQuery(mouseOverElement), whichClass);
		if (!hoverElement) {
			return null;
		}

		return hoverElement.scope();
	};

	//
	// Translate the coordinates so they are relative to the svg element.
	//
	this.translateCoordinates = function(x, y) {
		var svg_elem =  $element.get(0);
		var matrix = svg_elem.getScreenCTM();
		var point = svg_elem.createSVGPoint();
		point.x = x;
		point.y = y;
		return point.matrixTransform(matrix.inverse());
	};

	//
	// Called on mouse down in the chart.
	//
	$scope.mouseDown = function (evt) {

		$scope.chart.deselectAll();

		dragging.startDrag(evt, {

			dragging: function (deltaX, deltaY, x, y) {
				var startPoint = $scope.dragSelectionStartPoint;
				var curPoint = controller.translateCoordinates(x, y);

				$scope.dragSelectionRect = {
					x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
					y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
					width: curPoint.x > startPoint.x ? x - startPoint.x : startPoint.x - x,
					height: curPoint.y > startPoint.y ? y - startPoint.y : startPoint.y - y,
				};
			},

			dragStarted: function (x, y) {
				$scope.dragSelecting = true;
				var startPoint = controller.translateCoordinates(x, y);
				$scope.dragSelectionStartPoint = startPoint;
				$scope.dragSelectionRect = {
					x: startPoint.x,
					y: startPoint.y,
					width: 0,
					height: 0,
				};
			},

			dragEnded: function () {
				$scope.dragSelecting = false;
				$scope.chart.applySelectionRect($scope.dragSelectionRect);
				delete $scope.dragSelectionStartPoint;
				delete $scope.dragSelectionRect;
			},

			clicked: function () {
				console.log("Clicked...");
			},

		});
	};

	//
	// Handle the case when a connection has the mouse over it.
	//
	this.handleConnectionMouseOver = function (mouseOverElement, whichClass) {
		//
		// Retreive the connection the mouse is currently over.
		//
		var connectionScope = this.checkForHit(mouseOverElement, whichClass);
		$scope.mouseOverConnection = connectionScope != null ? connectionScope.connection : null;
		if ($scope.mouseOverConnection) {
			// Reset 'connector mouse over'.
			$scope.mouseOverConnector = null;
			return true;
		}
		else {
			return false;
		}
	};

	//
	// Handle the case when a connector has the mouse over it.
	//
	this.handleConnectorMouseOver = function (mouseOverElement, whichClass) {
		//
		// Retreive the connection the mouse is currently over.
		//
		var connectionScope = this.checkForHit(mouseOverElement, whichClass);
		$scope.mouseOverConnector = connectionScope != null ? connectionScope.connector : null;
		return $scope.mouseOverConnector != null;
	};

	//
	// Called for each mouse move on the svg element.
	//
	$scope.mouseMove = function (evt) {

		var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);
		if (mouseOverElement == null) {
			// Mouse isn't over anything.
			return;
		}

		if (!$scope.draggingConnection) { 

			// Only allow 'connection mouse over' when not dragging out a connection.

			if (controller.handleConnectionMouseOver(mouseOverElement, controller.connectionClass))
			{
				// Don't attempt to handle 'connector mouse-over'.
				return;
			}
		}

		// Check for 'connector mouse over'.

		controller.handleConnectorMouseOver(mouseOverElement, controller.connectorClass);
	};

	//
	// Handle mousedown on a node.
	//
	$scope.nodeMouseDown = function (evt, node) {

		var chart = $scope.chart;
		var lastMouseCoords;

		dragging.startDrag(evt, {

			dragStarted: function (x, y) {

				lastMouseCoords = controller.translateCoordinates(x, y);

				//
				// If nothing is selected when dragging starts, 
				// at least select the node we are dragging.
				//
				if (!node.selected()) {
					chart.deselectAll();
					node.select();
				}
			},
			
			dragging: function (x, y) {

				var curCoords = controller.translateCoordinates(x, y);
				var deltaX = curCoords.x - lastMouseCoords.x;
				var deltaY = curCoords.y - lastMouseCoords.y;

				chart.updateSelectedNodesLocation(deltaX, deltaY);

				lastMouseCoords = curCoords;
			},

			dragEnded: function () {
				console.log("Drag ended...");
			},

			clicked: function () {
				chart.handleNodeMouseDown(node, evt.ctrlKey);
			},

		});
	};

	//
	// Handle mousedown on a connection.
	//
	$scope.connectionMouseDown = function (evt, connection) {
		var chart = $scope.chart;
		chart.handleConnectionMouseDown(connection, evt.ctrlKey);

		// Don't let the chart handle the mouse down.
		evt.stopPropagation();
		evt.preventDefault();
	};

	//
	// Handle mousedown on an input connector.
	//
	$scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {

		//
		// Initiate dragging out of a connection.
		//
		dragging.startDrag(evt, {

			//
			// Called when the mouse has moved greater than the threshold distance
			// and dragging has commenced.
			//
			dragStarted: function (x, y) {

				var curCoords = controller.translateCoordinates(x, y);				

				$scope.draggingConnection = true;
				$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: curCoords.x,
					y: curCoords.y
				};
				$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
				$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
			},

			//
			// Called on mousemove while dragging out a connection.
			//
			dragging: function (x, y, evt) {
				var startCoords = controller.translateCoordinates(x, y);				
				$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: startCoords.x,
					y: startCoords.y
				};
				$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
				$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
			},

			//
			// Clean up when dragging has finished.
			//
			dragEnded: function () {

				if ($scope.mouseOverConnector && 
					$scope.mouseOverConnector !== connector) {

					//
					// Dragging has ended...
					// The mouse is over a valid connector...
					// Create a new connection.
					//
					$scope.chart.createNewConnection(connector, $scope.mouseOverConnector);
				}

				$scope.draggingConnection = false;
				delete $scope.dragPoint1;
				delete $scope.dragTangent1;
				delete $scope.dragPoint2;
				delete $scope.dragTangent2;
			},

		});
	};
};
