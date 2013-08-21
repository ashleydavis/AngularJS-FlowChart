
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
	// Create a mock scope and add any arguments as mock nodes.
	//
	var createMockScope = function (mockNodes) {

		var mockScope = {
			chart: {
				nodes: mockNodes,
				connections: [],
			},			

			$watch: function (name, fn) {
				mockScope.watches[name] = fn;
			},

			watches: {},
		};

		return mockScope;
	}

	//
	// Create a mock dragging directive.
	//
	var createMockDragging = function (startDrag) {
		var mockDragging = {
			startDrag: startDrag || function (evt, config) {
				config.clicked();
			},
		};

		return mockDragging;
	};

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

		var mockNode = {
			selected: false,
		};

		var mockScope = createMockScope([mockNode]);

		var mockDragging = {
			startDrag: jasmine.createSpy(),
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 0);

		expect(mockDragging.startDrag).toHaveBeenCalled();

	});

	it('test node is selected when clicked', function () {

		var mockNode = {
			selected: false,
		};

		var mockScope = createMockScope([mockNode]);
		var mockDragging = createMockDragging();

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 0);

		expect(mockNode.selected).toBe(true);
	});

	it('test can deslect all nodes', function () {

		var mockNode1 = {
			selected: true,
		};

		var mockNode2 = {
			selected: true,
		};

		var mockScope = createMockScope([mockNode1, mockNode2]);
		var mockDragging = createMockDragging();

		var testObject = new FlowChartController(mockScope, mockDragging);

		testObject.deselectAllNodes();

		expect(mockNode1.selected).toBe(false);
		expect(mockNode2.selected).toBe(false);
	});

	it('test other nodes are deselected when a node is clicked', function () {

		var mockSelectedNode = {
			selected: true,
		};

		var mockClickedNode = {
			selected: false,
		};

		var mockScope = createMockScope([mockSelectedNode, mockClickedNode]);
		var mockDragging = createMockDragging();

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 1);

		expect(mockSelectedNode.selected).toBe(false);
		expect(mockClickedNode.selected).toBe(true);
	});

	it('test nodes are deselected when background is clicked', function () {

		var mockSelectedNode = {
			selected: true,
		};

		var mockScope = createMockScope([mockSelectedNode]);
		var mockDragging = createMockDragging();

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.mouseDown(mockEvt);

		expect(mockSelectedNode.selected).toBe(false);
	});	

	it('test mouse down commences connector dragging', function () {

		var mockNode = {};
		var mockConnector = {};

		var mockScope = createMockScope([mockNode]);
		var mockDragging = createMockDragging(function (evt, config) {
			config.dragStarted(0, 0);
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockNode, mockConnector, 0, false);

		expect(mockScope.draggingConnection).toBe(true);		
	});

	it('test can end dragging', function () {

		var mockNode = {};
		var mockConnector = {};

		var draggingConfig = null;

		var mockScope = createMockScope([mockNode]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockNode, mockConnector, 0, false);

 		draggingConfig.dragStarted(0, 0);
 		draggingConfig.dragging(0, 0, 0, 0, mockEvt);
 		draggingConfig.dragEnded();

		expect(mockScope.draggingConnection).toBe(false);		
 	});

	it('test can make a connection by dragging', function () {

		var mockNode = {};
		var mockDraggingConnector = {};
		var mockDragOverConnector = {};

		var draggingConfig = null;

		var mockScope = createMockScope([ mockNode ]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.connectorMouseDown(mockEvt, mockNode, mockDraggingConnector, 0, false);

		expect(mockScope.chart.connections).toEqual([]);

 		draggingConfig.dragStarted(0, 0);
 		draggingConfig.dragging(0, 0, 0, 0, mockEvt);

 		// Fake out the mouse over connector.
 		testObject.mouseOverConnector = mockDragOverConnector;

 		draggingConfig.dragEnded();

		expect(mockScope.chart.connections.length).toBe(1);
		var connection = mockScope.chart.connections[0];
		expect(connection.source).toBe(mockDraggingConnector);
		expect(connection.dest).toBe(mockDragOverConnector);
 	});

 	it('test view-model is updated when data-model changes', function () {

 		var mockNode = {};

		var mockScope = createMockScope([ mockNode ]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);	

		spyOn(testObject, 'updateViewModel');

		// Trigger the data-model watch.
		var mockChart = {};
		mockScope.watches['chart'](mockChart);

		expect(testObject.updateViewModel).toHaveBeenCalled();
 	});

 	it('test chart data-model is wrapped in view-model', function () {

 		var mockNode = {};

		var mockScope = createMockScope([ mockNode ]);
		var mockDragging = createMockDragging(function (evt, config) {
			 draggingConfig = config;
		});

		var testObject = new FlowChartController(mockScope, mockDragging);	

		testObject.updateViewModel();

		expect(mockScope.chartViewModel).toBeDefined();
		expect(mockScope.chartViewModel).toNotBe(mockScope.chart);
		expect(mockScope.chartViewModel.nodes).toBeDefined();
		expect(mockScope.chartViewModel.nodes.length).toBe(1);

 	});
});