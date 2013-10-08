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
});
