AngularJS-FlowChart
===================

A WebUI control for visualizing and editing flow charts.

This isn't designed to be completely general purpose, but it will be a good basis if you need an SVG flowchart and you are willing to work with AngularJS.

Code Project Article
--------------------

http://www.codeproject.com/Articles/709340/Implementing-a-Flowchart-with-SVG-and-AngularJS


How to use it
-------------

Include the following Javascript in your HTML file:

```html
	<script src="flowchart/svg_class.js" type="text/javascript"></script>
	<script src="flowchart/mouse_capture_service.js" type="text/javascript"></script>
	<script src="flowchart/dragging_service.js" type="text/javascript"></script>
	<script src="flowchart/flowchart_viewmodel.js" type="text/javascript"></script>
	<script src="flowchart/flowchart_directive.js" type="text/javascript"></script>
```

Make a dependency on the the flowchart's AngularJS module from your application (or other module):

```javascript
	angular.module('app', ['flowChart', ])
```

In your application (or other) controller setup a data-model for the initial flowchart (or AJAX the data-model in from a JSON resource):

```javascript
	var chartDataModel = {

		nodes: [
			{
				name: "Example Node 1",
				id: 0,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
				outputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
			},

			{
				name: "Example Node 2",
				id: 1,
				x: 400,
				y: 200,
				inputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
				outputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
			},

		],

		connections: [
			{
				source: {
					nodeID: 0,
					connectorIndex: 1,
				},

				dest: {
					nodeID: 1,
					connectorIndex: 2,
				},
			},


		]
	};
```

Also in your controller, wrap the data-model in a view-model and add it to the AngularJS scope:

```javascript
	$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
```

Your code is in direct control of creation of the view-model, so you can interact with it in almost anyway you want.

Finally instantiate the flowchart's AngularJS directive in your HTML:

```html
    <flow-chart
		style="margin: 5px; width: 100%; height: 100%;"
      	chart="chartViewModel"
      	>
    </flow-chart>
```

Be sure to bind your view-model as the 'chart' attribute!


Have fun and please contribute!
