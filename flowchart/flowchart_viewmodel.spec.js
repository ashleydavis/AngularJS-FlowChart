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
			x: 10,
			y: 15,
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
			x: 5,
			y: 10,
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
			x: 50,
			y: 30,
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

});

