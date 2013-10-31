describe('flowchart-viewmodel', function () {

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

		var mockParentNodeViewModel = {
		};

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

	it('construct ChartViewModel with no nodes or connections', function () {

		var mockDataModel = {
		};

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

		var mockDataModel = {
		};

		var mockSourceConnector = {

		};

		var mockDestConnector = {

		};

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

	it('construct ChartViewModel with a node', function () {

		var mockNode = {

		};

		var mockDataModel = {
			nodes: [
				mockNode
			],
			connections: [
			],
		};

		var testObject = new flowchart.ChartViewModel(mockDataModel);
		expect(testObject.nodes.length).toBe(1);
		expect(testObject.nodes[0].data).toBe(mockNode);

	});

	it('data model with existing connection creates a connection view model', function () {

		var mockOutputConnector = {};

		var mockSourceNode = {
			
			id: 5,

			outputConnectors: [
				mockOutputConnector
			]
		};

		var mockInputConnector = {};

		var mockDestNode = {

			id: 12,

			inputConnectors: [
				{},
				mockInputConnector
			]
		};

		var mockConnection = {
			source: {
				nodeID: 5,
				connectorIndex: 0
			},

			dest: {
				nodeID: 12,
				connectorIndex: 1
			},
		};

		var mockDataModel = {
			nodes: [
				mockSourceNode,
				mockDestNode
			],
			connections: [
				mockConnection
			],
		};

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		expect(testObject.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockConnection);
		expect(testObject.connections[0].source.data).toBe(mockOutputConnector);
		expect(testObject.connections[0].dest.data).toBe(mockInputConnector);
	});

	it('test can deslect all nodes', function () {

		var mockNode = {

		};

		var mockConnection = {

		};

		var mockDataModel = {
			nodes: [
				mockNode, mockNode
			]
		};

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		testObject.nodes[0].selected = true;
		testObject.nodes[1].selected = true;

		testObject.deselectAllNodes();

		expect(testObject.nodes[0].selected).toBe(false);
		expect(testObject.nodes[1].selected).toBe(false);
	});

	it('test chart mouse down deselects all nodes', function () {

		var mockNode1 = {};
		var mockNode2 = {};
		var mockDataModel = {
			nodes: [
				mockNode1, mockNode2
			]
		};

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		// Fake out the nodes as selected.
		testObject.nodes[0].selected = true;
		testObject.nodes[1].selected = true;

		testObject.handleNodeMouseDown(0); // Doesn't matter which node is actually clicked.

		expect(testObject.nodes[0].selected).toBe(false);
		expect(testObject.nodes[1].selected).toBe(false);
	});

	it('test chart mouse down brings node to front', function () {

		var mockNode1 = {};
		var mockNode2 = {};
		var mockDataModel = {
			nodes: [
				mockNode1, mockNode2
			]
		};

		var testObject = new flowchart.ChartViewModel(mockDataModel);

		expect(testObject.nodes[0].data).toBe(mockNode1);
		expect(testObject.nodes[1].data).toBe(mockNode2);

		testObject.handleNodeMouseDown(0); // Mouse down on the 2nd node.

		expect(testObject.nodes[0].data).toBe(mockNode2); // Mock node 2 should be bought to front.
		expect(testObject.nodes[1].data).toBe(mockNode1);
	});

	it('test node selection is handled correctly', function () {

		var mockDataModel = {};
		var testObject = new flowchart.ChartViewModel(mockDataModel);

		var mockNodeViewModel = {};

		testObject.handleNodeSelected(mockNodeViewModel);

		expect(mockNodeViewModel.selected).toBe(true);
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
});
