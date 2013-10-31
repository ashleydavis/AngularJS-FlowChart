
describe('flowchart', function () {

	// 
	// Create a mock DOM element.
	//
	var createMockElement = function(attr, parent, scope) {
		return {
			attr: function() {
				return attr;
			},

			parent: function () {
				return parent;
			},		

			scope: function () {
				return scope || {};
			},

		};
	}

	//
	// Create a mock node data model.
	//
	var createMockNode = function (inputConnectors, outputConnectors) {
		return {
			x: function () { return 0 },
			y: function () { return 0 },
			inputConnectors: inputConnectors || [],
			outputConnectors: outputConnectors || [],
		};
	};

	//
	// Create a mock chart.
	//
	var createMockChart = function (mockNodes, mockConnections) {
		return {
			nodes: mockNodes,
			connections: mockConnections,

			handleNodeMouseDown: jasmine.createSpy(),
			updateNodeLocation: jasmine.createSpy(),
			handleNodeSelected: jasmine.createSpy(),
			deselectAllNodes: jasmine.createSpy(),
			createNewConnectionViewModel: jasmine.createSpy(),
		};
	};

	//
	// Create a mock scope and add any arguments as mock nodes.
	//
	var createMockScope = function (mockNodes, mockConnections) {

		var mockScope = {
			chart: createMockChart(mockNodes, mockConnections),

			$watch: function (name, fn) {
				mockScope.watches[name] = fn;
			},

			watches: {},
		};

		return mockScope;
	}

	//
	// Create a mock dragging service.
	//
	var createMockDragging = function (startDrag) {

		var mockDragging = {
			startDrag: function (evt, config) {
				mockDragging.evt = evt;
				mockDragging.config = config;

				if (startDrag) {
					startDrag(evt, config);
				}
			},
		};

		return mockDragging;
	};

	//
	// Create a mock dragging service that just does a click.
	//
	var createMockClicker = function () {
		return createMockDragging(function (evt, config) {
			config.clicked();
		});
	}

	it('findParentConnector returns null when at root 1', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		expect(testObject.findParentConnector(null)).toBe(null);
	});

	it('findParentConnector returns null when at root 2', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		expect(testObject.findParentConnector([])).toBe(null);
	});

	it('findParentConnector returns element when it has connector class', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		var mockElement = createMockElement(testObject.connectorClass);

		expect(testObject.findParentConnector(mockElement)).toBe(mockElement);
	});

	it('findParentConnector returns parent when it has connector class', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		var mockParent = createMockElement(testObject.connectorClass);
		var mockElement = createMockElement('', mockParent);

		expect(testObject.findParentConnector(mockElement)).toBe(mockParent);
	});

	it('hitTestForConnector returns null when no element hit', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		// Mock out the document.
		testObject.document = {
			elementFromPoint: function () {
				return null;
			},
		};

		expect(testObject.hitTestForConnector(0, 0, 'input')).toBe(null);
	});


	it('hitTestForConnector returns null when the hit element has no parent connector', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		var mockElement = createMockElement(null, null);

		// Mock out the document and jQuery.
		testObject.document = {
			elementFromPoint: function () {
				return mockElement;
			},
		};

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.hitTestForConnector(0, 0, 'input')).toBe(null);
	});

	it('hitTestForConnector returns the connector when found', function () {

		var mockScope = createMockScope([]);

		var testObject = new FlowChartController(mockScope);

		var mockConnector = {};
		var mockConnectorScope = { connector: mockConnector };
		var mockElement = createMockElement(testObject.connectorClass, null, mockConnectorScope);

		// Mock out the document and jQuery.
		testObject.document = {
			elementFromPoint: function () {
				return mockElement;
			},
		};

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.hitTestForConnector(0, 0, 'input')).toBe(mockConnector);
	});	

	it('test node dragging is started on node mouse down', function () {

		var mockScope = createMockScope([createMockNode()]);

		var mockDragging = {
			startDrag: jasmine.createSpy(),
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 0);

		expect(mockDragging.startDrag).toHaveBeenCalled();

	});

	it('test node click handling is forwarded to view model', function () {

		var mockNode = createMockNode();
		var mockScope = createMockScope([mockNode]);
		var mockDragging = createMockClicker();

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};
		var mockNodeIndex = 0;

		mockScope.nodeMouseDown(mockEvt, mockNodeIndex);

		expect(mockScope.chart.handleNodeMouseDown).toHaveBeenCalledWith(mockNodeIndex);
	});

	it('test node dragging updates node location', function () {

		var mockScope = createMockScope([createMockNode()]);
		var mockDragging = createMockDragging();

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 0);

		var xIncrement = 5;
		var yIncrement = 15;

		mockDragging.config.dragging(xIncrement, yIncrement, 10, 10);

		var node = mockScope.chart.nodes[0];

		expect(mockScope.chart.updateNodeLocation).toHaveBeenCalledWith(node, xIncrement, yIncrement);
	});

	it('test nodes are deselected when background is clicked', function () {

		var mockScope = createMockScope([createMockNode()]);
		var mockDragging = createMockClicker();

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.chart.nodes[0].selected = true;

		mockScope.mouseDown(mockEvt);

		expect(mockScope.chart.deselectAllNodes).toHaveBeenCalled();
	});	

	it('test mouse down commences connector dragging', function () {

		var mockNode = createMockNode();
		var mockConnector = {};

		var mockScope = createMockScope([mockNode]);
		var mockDragging = createMockDragging(function (evt, config) {
			config.dragStarted(0, 0);
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockScope.chart.nodes[0], mockScope.chart.nodes[0].inputConnectors[0], 0, false);

		expect(mockScope.draggingConnection).toBe(true);		
	});

	it('test can end dragging', function () {

		var mockNode = createMockNode();
		var mockConnector = {};

		var draggingConfig = null;

		var mockScope = createMockScope([mockNode]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockScope.chart.nodes[0], mockScope.chart.nodes[0].inputConnectors[0], 0, false);

 		draggingConfig.dragStarted(0, 0);
 		draggingConfig.dragging(0, 0, 0, 0, mockEvt);
 		draggingConfig.dragEnded();

		expect(mockScope.draggingConnection).toBe(false);		
 	});

	it('test can make a connection by dragging', function () {

		var mockNode = createMockNode();
		var mockDraggingConnector = {};
		var mockDragOverConnector = {};

		var draggingConfig = null;

		var mockScope = createMockScope([ mockNode ]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockScope.chart.nodes[0], mockDraggingConnector, 0, false);

 		draggingConfig.dragStarted(0, 0);
 		draggingConfig.dragging(0, 0, 0, 0, mockEvt);

 		// Fake out the mouse over connector.
 		testObject.mouseOverConnector = mockDragOverConnector;

 		draggingConfig.dragEnded();

 		expect(mockScope.chart.createNewConnectionViewModel).toHaveBeenCalledWith(mockDraggingConnector, mockDragOverConnector);
 	});

	it('test connection creation by dragging is cancelled when dragged over invalid connector', function () {

		var mockNode = createMockNode();
		var mockDraggingConnector = {};
		var mockDragOverConnector = {};

		var draggingConfig = null;

		var mockScope = createMockScope([ mockNode ]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockScope.chart.nodes[0], mockDraggingConnector, 0, false);

 		draggingConfig.dragStarted(0, 0);
 		draggingConfig.dragging(0, 0, 0, 0, mockEvt);

 		// Fake out the invalid connector.
 		testObject.mouseOverConnector = null;

 		draggingConfig.dragEnded();

 		expect(mockScope.chart.createNewConnectionViewModel).not.toHaveBeenCalled();
 	});

 	it('test can handle null nodes data model', function () {

 		var mockNode = {
 			inputConnectors: [
 			],

 			outputConnectors: [
 			],
 		};

		var mockScope = createMockScope();
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		new FlowChartController(mockScope, mockDragging);	
 	});

 	it('test can handle null connections data model', function () {

 		var mockNode = {
 			inputConnectors: [
 			],

 			outputConnectors: [
 			],
 		};

		var mockScope = createMockScope([ mockNode ]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		new FlowChartController(mockScope, mockDragging);	
 	});



});