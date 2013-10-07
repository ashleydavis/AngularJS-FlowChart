
//
// Global accessor.
//
var flowchart = {

};

// Module.
(function () {

	//
	// Compute the position of a connector relative to its node.
	//
	flowchart.computeLocalInputConnectorX = function () {
		return 80;
	};

	flowchart.computeLocalOutputConnectorX = function () {
		return 280;
	};

	flowchart.computeLocalConnectorY = function (connectorIndex) {
		return 100 + (connectorIndex * 36.5);
	};

	//
	// Compute the position of a connector in the graph.
	//
	flowchart.computeConnectorPos = function (node, connectorIndex, inputConnector) {
		return {
			x: node.x + 
				(inputConnector ? 
					flowchart.computeLocalInputConnectorX(connectorIndex) :
					flowchart.computeLocalOutputConnectorX(connectorIndex)),
			y: node.y + flowchart.computeLocalConnectorY(connectorIndex),
		};
	};

	//
	// View model for a connector.
	//
	flowchart.ConnectorViewModel = function (connectorDataModel, x, connectorIndex) {

		this.data = connectorDataModel;
		this.name = connectorDataModel.name;

		this.x = function () {
			return x;	
		};

		this.y = function () { 
			return flowchart.computeLocalConnectorY(connectorIndex);
		};

	};


})();