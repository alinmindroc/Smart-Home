angular.module('houseMonitoringApp').controller('windController', function ($scope, $uibModalInstance, windSpeed) {
  	function getWindPower(windSpeed){
    	//return power in kiloWatts for a 250 KW turbine
    	var generatedPower = 250;
    	return (generatedPower * windSpeed / 6).toFixed(2);
  	}

	$scope.windSpeed = windSpeed;
	$scope.generatedPower = getWindPower(windSpeed);

    $scope.ok = function() {
    	$uibModalInstance.close();
    };
});