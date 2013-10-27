
//
// Define the 'app' module.
//
angular.module('app', ['flowChart', ])

//
// Application controller.
//
.controller('AppCtrl', function AppCtrl ($scope) {

	//
	// Code for the delete key.
	//
	var deleteKeyCode = 46;

	//
	// Event handler for key-up on the flowchart.
	//
	$scope.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			//
			// Delete key.
			//
			//todo:
		}
	};

	//
	// Setup the data-model for the chart.
	//
	var chart = {

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

	$scope.chart = chart;
})

//
// http://stackoverflow.com/questions/17893708/angularjs-textarea-bind-to-json-object-shows-object-object
// 
.directive('jsonInput', function () {
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elem, attr, ctrl) {
        ctrl.$parsers.unshift(function(input) {
          try {
            var obj = JSON.parse(input);
            ctrl.$setValidity('jsonInput', true);
            return obj;
          } catch (e) {
            ctrl.$setValidity('jsonInput', false);
            return null;
          }
        });
        ctrl.$formatters.unshift(function(data) {
          if (data == null) {
            ctrl.$setValidity('jsonInput', false);
            return "";
          }
          try {
            var str = JSON.stringify(data, null, 4); // Ash: Added indenting to SO code.
            ctrl.$setValidity('jsonInput', true);
            return str;
          } catch (e) {
          ctrl.$setValidity('codeme', false);
              return "";
          }
        });
    }
  };

})

;