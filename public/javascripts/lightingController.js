angular.module('houseMonitoringApp').controller('lightingController', function ($scope, $uibModalInstance, lightingPlaces) {
	$scope.lightingPlaces = lightingPlaces ? lightingPlaces : [
		{name: 'living room', 'on': false},
		{name: 'bedroom', 'on': false},
		{name: 'balcony', 'on': false},
		{name: 'kitchen', 'on': false},
		{name: 'bathroom', 'on': false}
	];

	$scope.usedPower = 0;

    $scope.ok = function() {
    	for(var i in $scope.lightingPlaces){
    		if($scope.lightingPlaces[i].on == true){
    			$scope.usedPower += 0.02;
    		}
    	}
    	$uibModalInstance.close({states: $scope.lightingPlaces, KW: $scope.usedPower});
    };
});