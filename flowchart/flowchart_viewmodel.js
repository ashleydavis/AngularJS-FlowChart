
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
		return 0;
	};

	flowchart.computeLocalOutputConnectorX = function () {
		return 200;
	};

	flowchart.computeLocalConnectorY = function (connectorIndex) {
		return 40 + (connectorIndex * 35);
	};

	//
	// Compute the position of a connector in the graph.
	//
	flowchart.computeConnectorPos = function (node, connectorIndex, inputConnector) {
		return {
			x: node.x() + 
				(inputConnector ? 
					flowchart.computeLocalInputConnectorX(connectorIndex) :
					flowchart.computeLocalOutputConnectorX(connectorIndex)),
			y: node.y() + flowchart.computeLocalConnectorY(connectorIndex),
		};
	};

	//
	// View model for a connector.
	//
	flowchart.ConnectorViewModel = function (connectorDataModel, x, connectorIndex, parentNode) {

		this.data = connectorDataModel;

		this.name = function () {
			return this.data.name;
		}

		this.x = function () {
			return x;	
		};

		this.y = function () { 
			return flowchart.computeLocalConnectorY(connectorIndex);
		};

		this.parentNode = parentNode;
	};

	//
	// Create view model for a list of data models.
	//
	var createInputConnectorsViewModel = function (connectorDataModels, parentNode) {
		var viewModels = [];

		for (var i = 0; i < connectorDataModels.length; ++i) {
			viewModels.push(new flowchart.ConnectorViewModel(connectorDataModels[i], flowchart.computeLocalInputConnectorX(), i, parentNode));
		}

		return viewModels;
	};

	//
	// Create view model for a list of data models.
	//
	var createOutputConnectorsViewModel = function (connectorDataModels, parentNode) {
		var viewModels = [];

		for (var i = 0; i < connectorDataModels.length; ++i) {
			viewModels.push(new flowchart.ConnectorViewModel(connectorDataModels[i], flowchart.computeLocalOutputConnectorX(), i, parentNode));
		}

		return viewModels;
	};

	//
	// View model for a node.
	//
	flowchart.NodeViewModel = function (nodeDataModel) {


		this.data = nodeDataModel;

		// Set to true when the node is selected.
		this._selected = false;

		//
		// Name of the node.
		//
		this.name = function () {
			return this.data.name || "";
		};

		//
		// X coordinate of the node.
		//
		this.x = function () { 
			return this.data.x;
		};

		//
		// Y coordinate of the node.
		//
		this.y = function () {
			return this.data.y;
		};

		//
		// Select the node.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the node.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the node.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the node is selected.
		//
		this.selected = function () {
			return this._selected;
		};

		this.inputConnectors = createInputConnectorsViewModel(this.data.inputConnectors || [], this);
		this.outputConnectors = createOutputConnectorsViewModel(this.data.outputConnectors || [], this);
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
	flowchart.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

		this.data = connectionDataModel;
		this.source = sourceConnector;
		this.dest = destConnector;

		this.sourceCoordX = function () { 
			return this.source.parentNode.x() + this.source.x();
		};

		this.sourceCoordY = function () { 
			return this.source.parentNode.y() + this.source.y();
		};

		this.sourceCoord = function () {
			return {
				x: this.sourceCoordX(),
				y: this.sourceCoordY()
			};
		}

		this.sourceTangentX = function () { 
			return flowchart.computeConnectionSourceTangentX(this.sourceCoord(), this.destCoord());
		};

		this.sourceTangentY = function () { 
			return flowchart.computeConnectionSourceTangentY(this.sourceCoord(), this.destCoord());
		};

		this.destCoordX = function () { 
			return this.dest.parentNode.x() + this.dest.x();
		};

		this.destCoordY = function () { 
			return this.dest.parentNode.y() + this.dest.y();
		};

		this.destCoord = function () {
			return {
				x: this.destCoordX(),
				y: this.destCoordY()
			};
		}

		this.destTangentX = function () { 
			return flowchart.computeConnectionDestTangentX(this.sourceCoord(), this.destCoord());
		};

		this.destTangentY = function () { 
			return flowchart.computeConnectionDestTangentY(this.sourceCoord(), this.destCoord());
		};
	};

	//
	// Helper function.
	//
	var computeConnectionTangentOffset = function (pt1, pt2) {

		return (pt2.x - pt1.x) / 2;	
	}

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangentX = function (pt1, pt2) {

		return pt1.x + computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangentY = function (pt1, pt2) {

		return pt1.y;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangent = function(pt1, pt2) {
		return {
			x: flowchart.computeConnectionSourceTangentX(pt1, pt2),
			y: flowchart.computeConnectionSourceTangentY(pt1, pt2),
		};
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangentX = function (pt1, pt2) {

		return pt2.x - computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangentY = function (pt1, pt2) {

		return pt2.y;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangent = function(pt1, pt2) {
		return {
			x: flowchart.computeConnectionDestTangentX(pt1, pt2),
			y: flowchart.computeConnectionDestTangentY(pt1, pt2),
		};
	};

	//
	// View model for the chart.
	//
	flowchart.ChartViewModel = function (chartDataModel) {

		//
		// Find a specific node within the chart.
		//
		this.findNode = function (nodeID) {

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.data.id == nodeID) {
					return node;
				}
			}

			throw new Error("Failed to find node " + nodeID);
		};

		//
		// Find a specific input connector within the chart.
		//
		this.findInputConnector = function (nodeID, connectorIndex) {

			var node = this.findNode(nodeID);

			if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
				throw new Error("Node " + nodeID + " has invalid input connectors.");
			}

			return node.inputConnectors[connectorIndex];
		};

		//
		// Find a specific output connector within the chart.
		//
		this.findOutputConnector = function (nodeID, connectorIndex) {

			var node = this.findNode(nodeID);

			if (!node.outputConnectors || node.outputConnectors.length <= connectorIndex) {
				throw new Error("Node " + nodeID + " has invalid output connectors.");
			}

			return node.outputConnectors[connectorIndex];
		};

		//
		// Create a view model for connection from the data model.
		//
		this._createConnectionViewModel = function(connectionDataModel) {

			var sourceConnector = this.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.connectorIndex);
			var destConnector = this.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.connectorIndex);			
			return new flowchart.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
		}

		// 
		// Wrap the connections data-model in a view-model.
		//
		this._createConnectionsViewModel = function (connectionsDataModel) {

			var connectionsViewModel = [];

			if (connectionsDataModel) {
				for (var i = 0; i < connectionsDataModel.length; ++i) {
					connectionsViewModel.push(this._createConnectionViewModel(connectionsDataModel[i]));
				}
			}

			return connectionsViewModel;
		};

		// Reference to the underlying data.
		this.data = chartDataModel;

		// Create a view-model for nodes.
		this.nodes = createNodesViewModel(this.data.nodes);

		// Create a view-model for connections.
		this.connections = this._createConnectionsViewModel(this.data.connections);

		this.foo = "bah";

		//
		// Create a data for a new connection.
		//
		this.createNewConnectionDataModel = function (sourceConnector, destConnector) {

			var connectionsDataModel = this.data.connections;
			if (!connectionsDataModel) {
				connectionsDataModel = this.data.connections = [];
			}

			var connection = {
				source: sourceConnector,
				dest: destConnector
			};

			connectionsDataModel.push(connection);

			return connection;
		}

		//
		// Create a view model for a new connection.
		//
		this.createConnection = function (sourceConnector, destConnector) {

			//
			// Create a new data model.
			//
			var connectionDataModel = this.createNewConnectionDataModel(sourceConnector.data, destConnector.data);

			var connections = this.connections;
			if (!connections) {
				connections = this.connections = [];
			}

			var connectionViewModel = new flowchart.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
			connections.push(connectionViewModel);
		};		

		//
		// Deselect all nodes in the chart.
		//
		this.deselectAllNodes = function () {

			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; ++i) {
				var node = nodes[i];
				node.deselect();
			}
		};

		//
		// Update the location of the node and its connectors.
		//
		this.updateNodeLocation = function (node, deltaX, deltaY) {

			node.data.x += deltaX;
			node.data.y += deltaY;
		};

		//
		// Handle mouse down on a particular node.
		//
		this.handleNodeMouseDown = function (nodeIndex) {

			this.deselectAllNodes();

			var node = this.nodes[nodeIndex];
			node.select();

			// Move node to the end of the list so it is rendered after all the other.
			// This is the way Z-order is done in SVG.

			this.nodes.splice(nodeIndex, 1);
			this.nodes.push(node);			
		};

		//
		// Delete all nodes that are selected.
		//
		this.deleteSelectedNodes = function () {

			var newNodeViewModels = [];
			var newNodeDataModels = [];

			var deletedNodeIds = [];

			//
			// Sort nodes into:
			//		nodes to keep and 
			//		nodes to delete.
			//

			for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

				var node = this.nodes[nodeIndex];
				if (!node.selected()) {
					// Only retain non-selected nodes.
					newNodeViewModels.push(node);
					newNodeDataModels.push(node.data);
				}
				else {
					// Keep track of nodes that were deleted, so their connections can also
					// be deleted.
					deletedNodeIds.push(node.data.id);
				}
			}

			var newConnectionViewModels = [];
			var newConnectionDataModels = [];

			//
			// Remove connections for nodes that have been deleted.
			//
			for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

				var connection = this.connections[connectionIndex];				
				if (deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 && 
					deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1)
				{
					//
					// The nodes this connection is attached to, where not deleted,
					// so keep the connection.
					//
					newConnectionViewModels.push(connection);
					newConnectionDataModels.push(connection.data);
				}
			}

			//
			// Update nodes and connections.
			//
			this.nodes = newNodeViewModels;
			this.data.nodes = newNodeDataModels;
			this.connections = newConnectionViewModels;
			this.data.connections = newConnectionDataModels;
		};

	};

})();