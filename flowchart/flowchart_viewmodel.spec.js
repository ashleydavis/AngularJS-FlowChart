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

	it('construct ChartViewModel with nodes and connections', function () {

		var mockNode = {

		};

		var mockConnection = {

		};

		var mockDataModel = {
			nodes: [
				mockNode
			],
			connections: [
				mockConnection
			],
		};

		new flowchart.ChartViewModel(mockDataModel);

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
