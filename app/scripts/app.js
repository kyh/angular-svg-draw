'use strict';

angular.module('svgDrawApp', ['svgDrawing'])

  .controller('MainCtrl', function ($scope) {

    $scope.done = function(){
			console.log('done animation');
    };

  });
