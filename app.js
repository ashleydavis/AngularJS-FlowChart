
//
// Define the 'app' module.
//
angular.module('app', ['flowChart', ])

//
// Application controller.
//
.controller('AppCtrl', function AppCtrl ($scope) {

	//
	// Setup the data-model for the chart.
	//
	var chart = {

		nodes: [
			{
				title: "Example Node 1",
				id: 0,
				x: 250,
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
				title: "Example Node 2",
				id: 1,
				x: 600,
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

	$scope.chart = chart;

})

;