angular.module('houseMonitoringApp').controller('ACController', function ($scope, $uibModalInstance, state, temperature) {
	$scope.temperature = !temperature ? 20 : temperature;
	$scope.state = !state ? "OFF" : state;
	$scope.usedPower = 1;

	$scope.turnOn = function(){
		$scope.state = "ON";
	}

	$scope.turnOff = function(){
		$scope.state = "OFF";
	}

    $scope.ok = function() {
    	$uibModalInstance.close({state: $scope.state, temperature: $scope.temperature, KW: $scope.state == 'ON' ? $scope.usedPower : 0});
    };
});