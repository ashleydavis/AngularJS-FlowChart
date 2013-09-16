//
// Flowchart module.
//
angular.module('flowChart', ['dragging'] )

//
// Flowchart directive.
//
.directive('flowChart', function() {
  return {
  	restrict: 'E',
  	templateUrl: "flowchart/flowchart_template.html",
  	replace: true,
  	scope: {
  		chartDataModel: "=chart",
  	},

  	//
  	// Controller for the flowchart directive.
  	// Having a separate controller is better for unit testing, otherwise
  	// it is painful to unit test a directive without instantiating the DOM 
  	// (which is possible, just not ideal).
  	//
  	controller: FlowChartController,

  	//
  	// Angular link function, called to attach the directive's element to the its scope (its data-model).
  	//
  	link: function($scope, $element, $attrs, controller) {



 	},
  };
})
;

//
// Controller for the flowchart directive.
// Having a separate controller is better for unit testing, otherwise
// it is painful to unit test a directive without instantiating the DOM 
// (which is possible, just not ideal).
//
function FlowChartController ($scope, dragging) {

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

	//
	// Reference to the connector that the mouse is currently over.
	//
	this.mouseOverConnector = null;

	//
	// The class for connectors.
	//todo: should be configurable.
	//
	this.connectorClass = 'connector';

	//
	// Create a view model for an input connector.
	//
	var createInputConnectorViewModel = function (connectorDataModel) {
		return {
			data: connectorDataModel,
			name: connectorDataModel.name
		};
	};

	//
	// Create a view model for an output connector.
	//
	var createOutputConnectorViewModel = function (connectorDataModel) {
		return {
			data: connectorDataModel,
			name: connectorDataModel.name
		};
	};

	//
	// Create view model for a list of data models.
	//
	var createInputConnectorsViewModel = function (connectorDataModels) {
		var viewModels = [];

		for (var i = 0; i < connectorDataModels.length; ++i) {
			viewModels.push(createInputConnectorViewModel(connectorDataModels[i]));
		}

		return viewModels;
	};

	//
	// Create view model for a list of data models.
	//
	var createOutputConnectorsViewModel = function (connectorDataModels) {
		var viewModels = [];

		for (var i = 0; i < connectorDataModels.length; ++i) {
			viewModels.push(createOutputConnectorViewModel(connectorDataModels[i]));
		}

		return viewModels;
	};

	//
	// Create a view model for an individual node.
	//
	var createNodeViewModel = function (nodeDataModel) {
		return {
			x: nodeDataModel.x,
			y: nodeDataModel.y,
			data: nodeDataModel,
			inputConnectors: createInputConnectorsViewModel(nodeDataModel.inputConnectors),
			outputConnectors: createOutputConnectorsViewModel(nodeDataModel.outputConnectors)
		};
	};

	// 
	// Wrap the nodes data-model in a view-model.
	//
	var createNodesViewModel = function (nodesDataModel) {
		var nodesViewModel = [];

		for (var i = 0; i < nodesDataModel.length; ++i) {
			nodesViewModel.push(createNodeViewModel(nodesDataModel[i]));
		}

		return nodesViewModel;
	};

	//
	// Create a view model for an individual connection.
	//
	var createConnectionViewModel = function (connectionDataModel) {
		return {
			data: connectionDataModel,
		};
	};

	// 
	// Wrap the connections data-model in a view-model.
	//
	var createConnectionsViewModel = function (connectionsDataModel) {
		var connectionsViewModel = [];

		if (connectionsDataModel) {
			for (var i = 0; i < connectionsDataModel.length; ++i) {
				connectionsViewModel.push(createConnectionViewModel(connectionsDataModel[i]));
			}
		}

		return connectionsViewModel;
	};

	//
	// Wrap the data-model in a view-model.
	//
	var createChartViewModel = function (chartDataModel) {
		return {
			// Reference to the underlying data.
			data: chartDataModel,

			// Create a view-model for nodes.
			nodes: createNodesViewModel(chartDataModel.nodes),

			// Create a view-model for connections.
			connections: createConnectionsViewModel(chartDataModel.connections),

		};
	};

	//
	// Update the view-model from the data-model.
	//
	this.updateViewModel = function () {
		//
		// Create a view-model from the data-model.
		//
		$scope.chart = createChartViewModel($scope.chartDataModel);
	};

	//
	// When the chart has been changed, generate a view-model.
	//
	$scope.$watch('chartDataModel', function (newChart) {
		if (newChart) {
			controller.updateViewModel();
		}
	});

	//
	// Find the element that is the parent connector of the particular element.
	//
	this.findParentConnector = function (element) {

		//
		// Reached the root.
		//
		if (element == null || element.length == 0) {
			return null;
		}

		// 
		// Check if the element has the class that identifies it as a connector.
		//
		if (hasClassSVG(element, this.connectorClass)) {
			//
			// Found the connector element.
			//
			return element;
		}

		//
		// Recursively search parent elements.
		//
		return this.findParentConnector(element.parent());
	};

	//
	// Hit test and retreive node and connector that was hit at the specified coordinates.
	// type specifies whether you want input, output or both.
	//
	this.hitTestForConnector = function (clientX, clientY, type) {

		//
		// Retreive the element the mouse is currently over.
		//
		var mouseOverElement = this.document.elementFromPoint(clientX, clientY);
		if (!mouseOverElement) {
			return null;
		}

		//
		// Find the parent element, if any, that is a connector.
		//
		var hoverElement = this.findParentConnector(this.jQuery(mouseOverElement));
		if (!hoverElement) {
			return null;
		}

		var connectorScope = hoverElement.scope();
		return connectorScope.connector;
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
	this.computeConnectorPos = function (node, connectorIndex, inputConnector) {
		return {
			x: node.x + 
				(inputConnector ? 
					$scope.computeLocalInputConnectorX(connectorIndex) :
					$scope.computeLocalOutputConnectorX(connectorIndex)),
			y: node.y + $scope.computeLocalConnectorY(connectorIndex),
		};
	};

	//
	// Compute the tangent for the bezier curve.
	//
	this.computeDraggingTangent = function () {

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
	// Deselect all nodes in the chart.
	//
	this.deselectAllNodes = function () {

		var nodes = $scope.chart.nodes;
		for (var i = 0; i < nodes.length; ++i) {
			nodes[i].selected = false;
		}
	};

	$scope.mouseDown = function (evt) {

		controller.deselectAllNodes();

	};

	//
	// Called for each mouse move on the svg element.
	//
	$scope.mouseMove = function (evt) {

		//
		// Retreive the connector the mouse is currently over.
		//
		var curMouseOverConnector = controller.hitTestForConnector(evt.clientX, evt.clientY);
		if (curMouseOverConnector != controller.mouseOverConnector) {

			if (controller.mouseOverConnector) {

				// Clear the previous 'mouse over' connector.
				controller.mouseOverConnector.isMouseOver = false;
			}

			// Mark the connector as 'mouse over' so that we can change its appearance from the view.
			if (curMouseOverConnector) {

				curMouseOverConnector.isMouseOver = true; 
			}

			controller.mouseOverConnector = curMouseOverConnector;
		}

	};

	$scope.nodeMouseDown = function (evt, nodeIndex) {

		controller.deselectAllNodes();

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
				node.selected = true;
			},

		});

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

				$scope.draggingConnection = true;
				$scope.dragPoint1 = controller.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: x,
					y: y
				};
				controller.computeDraggingTangent();
			},

			//
			// Called on mousemove while dragging out a connection.
			//
			dragging: function (deltaX, deltaY, x, y, evt) {
				$scope.dragPoint1 = controller.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: x,
					y: y
				};
				controller.computeDraggingTangent();
			},

			//
			// Clean up when dragging has finished.
			//
			dragEnded: function () {

				if (controller.mouseOverConnector !== connector) {
					// 
					// Create a connection.
					//
					var connections = $scope.chart.connections;
					if (!connections) {
						connections = $scope.chart.connections = [];
					}
					connections.push({
						source: connector,
						dest: controller.mouseOverConnector,

						sourceCoord: $scope.dragPoint1,
						sourceTangent: $scope.dragTangent1,
						destCoord: $scope.dragPoint2,
						destTangent: $scope.dragTangent2,
					});
				}

				$scope.draggingConnection = false;
				delete $scope.dragPoint1;
				delete $scope.dragTangent1;
				delete $scope.dragPoint2;
				delete $scope.dragTangent2;
			},

		});
	};
}
