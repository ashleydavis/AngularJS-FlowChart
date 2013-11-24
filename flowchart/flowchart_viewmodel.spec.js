describe('flowchart-viewmodel', function () {

	//
	// Create a mock data model from a simple definition.
	//
	var createMockDataModel = function (nodeIds, connections) {

		var nodeDataModels = [];

		for (var i = 0; i < nodeIds.length; ++i) {
			nodeDataModels.push({
				id: nodeIds[i],
				inputConnectors: [ {}, {}, {} ],
				outputConnectors: [ {}, {}, {} ],
			});
		}

		var connectionDataModels = [];

		if (connections) {
			for (var i = 0; i < connections.length; ++i) {
				connectionDataModels.push({
					source: {
						nodeID: connections[i][0][0],
						connectorIndex: connections[i][0][1],
					},
					dest: {
						nodeID: connections[i][1][0],
						connectorIndex: connections[i][1][1],
					},
				});
			}
		}

 		return {
 			nodes: nodeDataModels,
 			connections: connectionDataModels,
 		};
	};

	it('compute input connector x', function () {

		flowchart.computeLocalInputConnectorX();
	});

	it('compute output connector x', function () {

		flowchart.computeLocalOutputConnectorX();
	});

	it('compute connector y', function () {

		flowchart.computeLocalConnectorY(0);
		flowchart.computeLocalConnectorY(1);
		flowchart.computeLocalConnectorY(2);
	});

	it('compute computeConnectorPos', function () {

		var mockNode = {
			x: function () { return 10 },
			y: function () { return 15 },
		};

		flowchart.computeConnectorPos(mockNode, 0, true);
		flowchart.computeConnectorPos(mockNode, 1, true);
		flowchart.computeConnectorPos(mockNode, 2, true);
	});

	it('construct ConnectorViewModel', function () {

		var mockDataModel = {
			name: "Fooey",
		};

		new flowchart.ConnectorViewModel(mockDataModel, 10, 0);
		new flowchart.ConnectorViewModel(mockDataModel, 10, 1);
		new flowchart.ConnectorViewModel(mockDataModel, 10, 2);

	});

	it('ConnectorViewModel has reference to parent node', function () {

		var mockDataModel = {
			name: "Fooey",
		};
		var mockParentNodeViewModel = {};

		var testObject = new flowchart.ConnectorViewModel(mockDataModel, 10, 0, mockParentNodeViewModel);

		expect(testObject.parentNode).toBe(mockParentNodeViewModel);
	});

	it('construct NodeViewModel with no connectors', function () {

		var mockDataModel = {
			x: 10,
			y: 12,
			name: "Woot",
		};

		new flowchart.NodeViewModel(mockDataModel);
	});

	it('construct NodeViewModel with empty connectors', function () {

		var mockDataModel = {
			x: 10,
			y: 12,
			name: "Woot",
			inputConnectors: [],
			outputConnectors: [],
		};

		new flowchart.NodeViewModel(mockDataModel);
	});

	it('construct NodeViewModel with connectors', function () {

		var mockInputConnector = {
			name: "Input",
		};		

		var mockOutputConnector = {
			name: "Output",
		};		

		var mockDataModel = {
			x: 10,
			y: 12,
			name: "Woot",
			inputConnectors: [
				mockInputConnector
			],
			outputConnectors: [
				mockOutputConnector
			],
		};

		new flowchart.NodeViewModel(mockDataModel);
	});

	it('test name of NodeViewModel', function () {

		var mockDataModel = {
			name: "Woot",
		};

		var testObject = new flowchart.NodeViewModel(mockDataModel);

		expect(testObject.name()).toBe(mockDataModel.name);
	});

	it('test name of NodeViewModel defaults to empty string', function () {

		var mockDataModel = {};

		var testObject = new flowchart.NodeViewModel(mockDataModel);

		expect(testObject.name()).toBe("");
	});

	it('test node is deselected by default', function () {

		var mockDataModel = {};

		var testObject = new flowchart.NodeViewModel(mockDataModel);

		expect(testObject.selected()).toBe(false);
	});

	it('test node can be selected', function () {

		var mockDataModel = {};

		var testObject = new flowchart.NodeViewModel(mockDataModel);

		testObject.select();

		expect(testObject.selected()).toBe(true);
	});

	it('test node can be deselected', function () {

		var mockDataModel = {};

		var testObject = new flowchart.NodeViewModel(mockDataModel);

		testObject.select();

		testObject.deselect();

		expect(testObject.selected()).toBe(false);
	});

	it('test node can be selection can be toggled', function () {

		var mockDataModel = {};

		var testObject = new flowchart.NodeViewModel(mockDataModel);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(true);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(false);
	});

	it('construct ChartViewModel with no nodes or connections', function () {

		var mockDataModel = {};

		new flowchart.ChartViewModel(mockDataModel);

	});

	it('construct ChartViewModel with empty nodes and connections', function () {

		var mockDataModel = {
			nodes: [],
			connections: [],
		};

		new flowchart.ChartViewModel(mockDataModel);

	});

	it('construct ConnectionViewModel', function () {

		var mockDataModel = {};
		var mockSourceConnector = {};
		var mockDestConnector = {};

		new flowchart.ConnectionViewModel(mockDataModel, mockSourceConnector, mockDestConnector);
	});

	it('retreive source and dest coordinates', function () {

		var mockDataModel = {
		};

		var mockSourceParentNode = {
			x: function () { return 5 },
			y: function () { return 10 },
		};

		var mockSourceConnector = {
			parentNode: mockSourceParentNode,

			x: function() {
				return 5;
			},

			y: function() {
				return 15;
			},
		};

		var mockDestParentNode = {
			x: function () { return 50 },
			y: function () { return 30 },
		};

		var mockDestConnector = {
			parentNode: mockDestParentNode,

			x: function() {
				return 25;
			},

			y: function() {
				return 35;
			},
		};

		var testObject = new flowchart.ConnectionViewModel(mockDataModel, mockSourceConnector, mockDestConnector);

		testObject.sourceCoord();
		expect(testObject.sourceCoordX()).toBe(10);
		expect(testObject.sourceCoordY()).toBe(25);
		testObject.sourceTangentX();
		testObject.sourceTangentY();
		
		testObject.destCoord();
		expect(testObject.destCoordX()).toBe(75);
		expect(testObject.destCoordY()).toBe(65);
		testObject.destTangentX();
		testObject.destTangentY();
	});

	it('test connection is deselected by default', function () {

		var mockDataModel = {};

		var testObject = new flowchart.ConnectionViewModel(mockDataModel);

		expect(testObject.selected()).toBe(false);
	});

	it('test connection can be selected', function () {

		var mockDataModel = {};

		var testObject = new flowchart.ConnectionViewModel(mockDataModel);

		testObject.select();

		expect(testObject.selected()).toBe(true);
	});

	it('test connection can be deselected', function () {

		var mockDataModel = {};

		var testObject = new flowchart.ConnectionViewModel(mockDataModel);

		testObject.select();

		testObject.deselect();

		expect(testObject.selected()).toBe(false);
	});

	it('test connection can be selection can be toggled', function () {

		var mockDataModel = {};

		var testObject = new flowchart.ConnectionViewModel(mockDataModel);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(true);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(false);
	});

	it('construct ChartViewModel with a node', function () {

		var mockDataModel = createMockDataModel([1]);

		var testObject = new flowchart.ChartViewModel(mockDataModel);
		expect(testObject.nodes.length).toBe(1);
		expect(testObject.nodes[0].data).toBe(mockDataModel.nodes[0]);

	});

	it('data model with existing connection creates a connection view model', function () {

		var mockDataModel = createMockDataModel(
			[ 5, 12 ],
			[
				[[ 5, 0 ], [ 12, 1 ]],
			]
		);

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		expect(testObject.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockDataModel.connections[0]);
		expect(testObject.connections[0].source.data).toBe(mockDataModel.nodes[0].outputConnectors[0]);
		expect(testObject.connections[0].dest.data).toBe(mockDataModel.nodes[1].inputConnectors[1]);
	});

	it('test can deselect all nodes', function () {

		var mockDataModel = createMockDataModel([1, 2]);

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		var node1 = testObject.nodes[0];
		var node2 = testObject.nodes[1];

		node1.select();
		node2.select();

		testObject.deselectAll();

		expect(node1.selected()).toBe(false);
		expect(node2.selected()).toBe(false);
	});

	it('test can deselect all connections', function () {

		var mockDataModel = createMockDataModel(
			[ 5, 12 ],
			[
				[[ 5, 0 ], [ 12, 1 ]],
				[[ 5, 0 ], [ 12, 1 ]],
			]
		);

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];

		connection1.select();
		connection2.select();

		testObject.deselectAll();

		expect(connection1.selected()).toBe(false);
		expect(connection2.selected()).toBe(false);
	});

	it('test chart mouse down deselects nodes other than the one clicked', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3 ]);

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		var node1 = testObject.nodes[0];
		var node2 = testObject.nodes[1];
		var node3 = testObject.nodes[2];

		// Fake out the nodes as selected.
		node1.select();
		node2.select();
		node3.select();

		testObject.handleNodeMouseDown(1); // Doesn't matter which node is actually clicked.

		expect(node1.selected()).toBe(false);
		expect(node2.selected()).toBe(true);
		expect(node3.selected()).toBe(false);
	});

	it('test node mouse down selects the clicked node', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3 ]);

		var testObject = new flowchart.ChartViewModel(mockDataModel);
		
		var node1 = testObject.nodes[0];
		var node2 = testObject.nodes[1];
		var node3 = testObject.nodes[2];

		testObject.handleNodeMouseDown(2); // Doesn't matter which node is actually clicked.

		expect(node1.selected()).toBe(false);
		expect(node2.selected()).toBe(false);
		expect(node3.selected()).toBe(true);
	});

	it('test chart mouse down brings node to front', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ]);

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		var node1 = testObject.nodes[0];
		var node2 = testObject.nodes[1];

		testObject.handleNodeMouseDown(0); // Mouse down on the 2nd node.

		expect(testObject.nodes[0]).toBe(node2); // Mock node 2 should be bought to front.
		expect(testObject.nodes[1]).toBe(node1);
	});

	it('test chart mouse down deselects connections other than the one clicked', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ]],
				[[ 2, 1 ], [ 3, 2 ]],
				[[ 1, 2 ], [ 3, 0 ]]
			]
		);

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];
		var connection3 = testObject.connections[2];

		// Fake out the connections as selected.
		connection1.select();
		connection2.select();
		connection3.select();

		testObject.handleConnectionMouseDown(connection2);

		expect(connection1.selected()).toBe(false);
		expect(connection2.selected()).toBe(true);
		expect(connection3.selected()).toBe(false);
	});

	it('test node mouse down selects the clicked connection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ]],
				[[ 2, 1 ], [ 3, 2 ]],
				[[ 1, 2 ], [ 3, 0 ]]
			]
		);

		var testObject = new flowchart.ChartViewModel(mockDataModel);
		
		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];
		var connection3 = testObject.connections[2];

		testObject.handleConnectionMouseDown(connection3);

		expect(connection1.selected()).toBe(false);
		expect(connection2.selected()).toBe(false);
		expect(connection3.selected()).toBe(true);
	});	

 	it('test chart data-model is wrapped in view-model', function () {

 		var mockInputConnector = {
 			name: "Input1",
 		};

 		var mockOutputConnector = {
			name: "Output1",
 		};

 		var mockNode = {
 			inputConnectors: [
 				mockInputConnector
 			],

 			outputConnectors: [
 				mockOutputConnector
 			],
 		};

 		var mockDataModel = {
 			nodes: [
 				mockNode
 			],
 		};

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		// Chart

		expect(testObject).toBeDefined();
		expect(testObject).toNotBe(mockDataModel);
		expect(testObject.data).toBe(mockDataModel);
		expect(testObject.nodes).toBeDefined();
		expect(testObject.nodes.length).toBe(1);

		// Node

		var node = testObject.nodes[0];

		expect(node).toNotBe(mockNode);
		expect(node.data).toBe(mockNode);

		expect(node.inputConnectors.length).toBe(1);

		var inputConnector = node.inputConnectors[0];
		expect(inputConnector.data).toBe(mockInputConnector);
		expect(inputConnector.name()).toBe(mockInputConnector.name);

		expect(node.outputConnectors.length).toBe(1);
		
		var outputConnector = node.outputConnectors[0];
		expect(outputConnector.data).toBe(mockOutputConnector);
		expect(outputConnector.name()).toBe(mockOutputConnector.name);

		// Connectors

		expect(node.inputConnectors.length).toBe(1);

		var inputConnector = node.inputConnectors[0];
		expect(inputConnector.data).toBe(mockInputConnector);
		expect(inputConnector.name()).toBe(mockInputConnector.name);

		expect(node.outputConnectors.length).toBe(1);
		
		var outputConnector = node.outputConnectors[0];
		expect(outputConnector.data).toBe(mockOutputConnector);
		expect(outputConnector.name()).toBe(mockOutputConnector.name);

		// Connection
 	
		expect(testObject.connections.length).toBe(0);
 	});

	it('test can delete 1st selected node', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ]);

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.nodes.length).toBe(2);

		testObject.nodes[0].select();

		var mockNode2 = mockDataModel.nodes[1];

		testObject.deleteSelected();

		expect(testObject.nodes.length).toBe(1);
		expect(mockDataModel.nodes.length).toBe(1);
		expect(testObject.nodes[0].data).toBe(mockNode2);
	});

	it('test can delete 2nd selected nodes', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ]);

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.nodes.length).toBe(2);

		testObject.nodes[1].select();

		var mockNode1 = mockDataModel.nodes[0];

		testObject.deleteSelected();

		expect(testObject.nodes.length).toBe(1);
		expect(mockDataModel.nodes.length).toBe(1);
		expect(testObject.nodes[0].data).toBe(mockNode1);
	});

	it('test can delete multiple selected nodes', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3, 4 ]);

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.nodes.length).toBe(4);

		testObject.nodes[1].select();
		testObject.nodes[2].select();

		var mockNode1 = mockDataModel.nodes[0];
		var mockNode4 = mockDataModel.nodes[3];

		testObject.deleteSelected();

		expect(testObject.nodes.length).toBe(2);
		expect(mockDataModel.nodes.length).toBe(2);
		expect(testObject.nodes[0].data).toBe(mockNode1);
		expect(testObject.nodes[1].data).toBe(mockNode4);
	});
	
	it('deleting a node also deletes its connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 0 ], [ 3, 0 ]],
			]
		);

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(2);

		// Select the middle node.
		testObject.nodes[1].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(0);
	});

	it('deleting a node doesnt delete other connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ],]
			]
		);

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(1);

		// Select the middle node.
		testObject.nodes[1].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(1);
	});

	it('test can delete 1st selected connection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]]
			]
		);

		var mockRemainingConnectionDataModel = mockDataModel.connections[1];

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(2);

		testObject.connections[0].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(1);
		expect(mockDataModel.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockRemainingConnectionDataModel);
	});

	it('test can delete 2nd selected connection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]]
			]
		);

		var mockRemainingConnectionDataModel = mockDataModel.connections[0];

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(2);

		testObject.connections[1].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(1);
		expect(mockDataModel.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockRemainingConnectionDataModel);
	});


	it('test can delete multiple selected connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]],
				[[ 1, 1 ], [ 3, 0 ]],
				[[ 3, 2 ], [ 2, 1 ]]
			]
		);

		var mockRemainingConnectionDataModel1 = mockDataModel.connections[0];
		var mockRemainingConnectionDataModel2 = mockDataModel.connections[3];

		var testObject = new flowchart.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(4);

		testObject.connections[1].select();
		testObject.connections[2].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(2);
		expect(mockDataModel.connections.length).toBe(2);
		expect(testObject.connections[0].data).toBe(mockRemainingConnectionDataModel1);
		expect(testObject.connections[1].data).toBe(mockRemainingConnectionDataModel2);
	});
});
