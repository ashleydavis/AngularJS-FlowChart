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

  	//
  	// Angular link function, called to attach the directive's element to the its scope (its data-model).
  	//
  	link: function($scope, $element, $attrs, controller) {



 	},
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
flowchart_directive.FlowChartController = function ($scope, dragging) {

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
	// Called on mouse down in the chart.
	//
	$scope.mouseDown = function (evt) {

		$scope.chart.deselectAllNodes();
	};

	//
	// Determine if the mouse is over a connection and set it in the scope.
	//
	this.checkForConnectionMouseOver = function (mouseOverElement, whichClass) {
		//
		// Retreive the connection the mouse is currently over.
		//
		var connectionScope = this.checkForHit(mouseOverElement, whichClass);
		$scope.mouseOverConnection = connectionScope != null ? connectionScope.connection : null;
		return $scope.mouseOverConnection != null;
	};

	//
	// Determine if the mouse is over a connector and set it in the scope.
	//
	this.checkForConnectorMouseOver = function (mouseOverElement, whichClass) {
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

			//
			// Retreive the connection the mouse is currently over.
			//
			if (controller.checkForConnectionMouseOver(mouseOverElement, controller.connectionClass))
			{
				$scope.mouseOverConnector = null;
				return;
			}
		}

		//
		// Retreive the connector the mouse is currently over.
		//
		controller.checkForConnectorMouseOver(mouseOverElement, controller.connectorClass);
	};

	//
	// Handle mousedown on a node.
	//
	$scope.nodeMouseDown = function (evt, nodeIndex) {

		var chart = $scope.chart;
		var node = chart.nodes[nodeIndex];

		chart.handleNodeMouseDown(nodeIndex);

		dragging.startDrag(evt, {

			dragging: function (deltaX, deltaY, x, y) {

				chart.updateNodeLocation(node, deltaX, deltaY);
			},

			dragStarted: function () {
				console.log("Drag started...");
			},

			dragEnded: function () {
				console.log("Drag ended...");
			},

			clicked: function () {
				console.log("Clicked...");
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
				$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: x,
					y: y
				};
				$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
				$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
			},

			//
			// Called on mousemove while dragging out a connection.
			//
			dragging: function (deltaX, deltaY, x, y, evt) {
				$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: x,
					y: y
				};
				$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
				$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
			},

			//
			// Clean up when dragging has finished.
			//
			dragEnded: function () {

				if (controller.mouseOverConnector && 
					controller.mouseOverConnector !== connector) {

					$scope.chart.createConnection(connector, controller.mouseOverConnector);
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
