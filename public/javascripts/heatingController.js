angular.module('houseMonitoringApp').controller('heatingController', function ($scope, $uibModalInstance, state, temperature) {
	$scope.temperature = !temperature ? 20 : temperature;
	$scope.state = !state ? "OFF" : state;

	$scope.turnOn = function(){
		$scope.state = "ON";
	}

	$scope.turnOff = function(){
		$scope.state = "OFF";
	}

    $scope.ok = function() {
    	$uibModalInstance.close({state: $scope.state, temperature: $scope.temperature});
    };
});