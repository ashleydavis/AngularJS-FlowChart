
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

	//
	// Create view model for a list of data models.
	//
	var createInputConnectorsViewModel = function (connectorDataModels) {
		var viewModels = [];

		for (var i = 0; i < connectorDataModels.length; ++i) {
			viewModels.push(new flowchart.ConnectorViewModel(connectorDataModels[i], flowchart.computeLocalInputConnectorX(), i));
		}

		return viewModels;
	};

	//
	// Create view model for a list of data models.
	//
	var createOutputConnectorsViewModel = function (connectorDataModels) {
		var viewModels = [];

		for (var i = 0; i < connectorDataModels.length; ++i) {
			viewModels.push(new flowchart.ConnectorViewModel(connectorDataModels[i], flowchart.computeLocalOutputConnectorX(), i));
		}

		return viewModels;
	};

	//
	// View model for a node.
	//
	flowchart.NodeViewModel = function (nodeDataModel) {

		this.x = nodeDataModel.x;
		this.y = nodeDataModel.y;
		this.data = nodeDataModel;
		this.inputConnectors = createInputConnectorsViewModel(nodeDataModel.inputConnectors || []);
		this.outputConnectors = createOutputConnectorsViewModel(nodeDataModel.outputConnectors || []);
	};

	// 
	// Wrap the nodes data-model in a view-model.
	//
	var createNodesViewModel = function (nodesDataModel) {
		var nodesViewModel = [];

		if (nodesDataModel) {
			for (var i = 0; i < nodesDataModel.length; ++i) {
				nodesViewModel.push(new flowchart.NodeViewModel(nodesDataModel[i]));
			}
		}

		return nodesViewModel;
	};

	//
	// View model for a connection.
	//
	flowchart.ConnectionViewModel = function (connectionDataModel) {
		this.data = connectionDataModel;
	};

	// 
	// Wrap the connections data-model in a view-model.
	//
	var createConnectionsViewModel = function (connectionsDataModel) {
		var connectionsViewModel = [];

		if (connectionsDataModel) {
			for (var i = 0; i < connectionsDataModel.length; ++i) {
				connectionsViewModel.push(new flowchart.ConnectionViewModel(connectionsDataModel[i]));
			}
		}

		return connectionsViewModel;
	};

	//
	// View model for the chart.
	//
	flowchart.ChartViewModel = function (chartDataModel) {

		// Reference to the underlying data.
		this.data = chartDataModel;

		// Create a view-model for nodes.
		this.nodes = createNodesViewModel(chartDataModel.nodes);

		// Create a view-model for connections.
		this.connections = createConnectionsViewModel(chartDataModel.connections);
	};


})();