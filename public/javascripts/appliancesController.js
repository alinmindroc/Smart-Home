angular.module('houseMonitoringApp').controller('appliancesController', function ($scope, $uibModalInstance, appliances) {
	$scope.appliances = appliances ? appliances : [
		{name: 'fridge', 'on': false},
		{name: 'washing machine', 'on': false},
		{name: 'oven', 'on': false},
		{name: 'exhaust hood', 'on': false}
	];

	$scope.usedPower = 0;

    $scope.ok = function() {
    	for(var i in $scope.appliances){
    		if($scope.appliances[i].on == true){
    			$scope.usedPower += 1;
    		}
    	}
       	$uibModalInstance.close({states: $scope.appliances, KW: $scope.usedPower});
    };
});