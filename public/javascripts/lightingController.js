angular.module('houseMonitoringApp').controller('lightingController', function ($scope, $uibModalInstance, lightingPlaces) {
	$scope.lightingPlaces = lightingPlaces ? lightingPlaces : [
		{name: 'living room', 'on': true},
		{name: 'bedroom', 'on': true},
		{name: 'balcony', 'on': false},
		{name: 'kitchen', 'on': false},
		{name: 'bathroom', 'on': true}
	];

    $scope.ok = function() {
    	$uibModalInstance.close($scope.lightingPlaces);
    };
});