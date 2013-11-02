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
	// Reference to the connector that the mouse is currently over.
	//
	this.mouseOverConnector = null;

	//
	// The class for connectors.
	//
	this.connectorClass = 'connector';

	//
	// Find the HTML element that is the parent connector of the particular element.
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
	//
	this.hitTestForConnector = function (clientX, clientY) {

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
	// Called on mouse down in the chart.
	//
	$scope.mouseDown = function (evt) {

		$scope.chart.deselectAllNodes();
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
