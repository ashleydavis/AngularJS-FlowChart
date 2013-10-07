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
});
