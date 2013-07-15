
describe('flowchart', function () {

	// 
	// Create a mock DOM element.
	//
	var createMockElement = function(attr, parent) {
		return {
			attr: function() {
				return attr;
			},

			parent: function () {
				return parent;
			},		
		};
	}

	it('findParentConnector returns null when at root 1', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		expect(testObject.findParentConnector(null)).toBe(null);
	});

	it('findParentConnector returns null when at root 2', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		expect(testObject.findParentConnector([])).toBe(null);
	});

	it('findParentConnector returns element when it has connector class', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockElement = createMockElement(testObject.connectorClass);

		expect(testObject.findParentConnector(mockElement)).toBe(mockElement);
	});

	it('findParentConnector returns parent when it has connector class', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockParent = createMockElement(testObject.connectorClass);
		var mockElement = createMockElement('', mockParent);

		expect(testObject.findParentConnector(mockElement)).toBe(mockParent);
	});

	it('hitTestForConnector returns null when no element hit', function () {

		var mockScope = {};

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

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockElement = {
			attr: function () {

			},

			parent: function () {
				return null;
			},
		};

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

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockConnector = {};

		var mockElement = {
			attr: function () {
				return testObject.connectorClass;
			},

			parent: function () {
				return null;
			},

			scope: function () {
				return {
					connector: mockConnector,
				};
			},
		};

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
});