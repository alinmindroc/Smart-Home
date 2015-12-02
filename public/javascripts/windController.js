angular.module('houseMonitoringApp').controller('windController', function ($scope, $uibModalInstance, windSpeed) {
	function getPowerGenerated(windSpeed){
		//return power in kiloWatts - for a 250 KW turbine
		return 250 * windSpeed / 6;
	}

	$scope.windSpeed = windSpeed;
	$scope.generatedPower = getPowerGenerated(windSpeed);

    $scope.ok = function() {
    	$uibModalInstance.close();
    };
});