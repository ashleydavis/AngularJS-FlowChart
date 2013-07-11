
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

		var testObject = new FlowChartController();

		expect(testObject.findParentConnector(null)).toBe(null);
	});

	it('findParentConnector returns null when at root 2', function () {

		var testObject = new FlowChartController();

		expect(testObject.findParentConnector([])).toBe(null);
	});

	it('findParentConnector returns element when it has connector class', function () {

		var testObject = new FlowChartController();

		var mockElement = createMockElement(testObject.connectorClass);

		expect(testObject.findParentConnector(mockElement)).toBe(mockElement);
	});

	it('findParentConnector returns parent when it has connector class', function () {

		var testObject = new FlowChartController();

		var mockParent = createMockElement(testObject.connectorClass);
		var mockElement = createMockElement('', mockParent);

		expect(testObject.findParentConnector(mockElement)).toBe(mockParent);
	});
});