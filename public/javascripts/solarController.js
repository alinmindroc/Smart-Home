angular.module('houseMonitoringApp').controller('solarController', function ($scope, $uibModalInstance, sunrise, sunset, cloudsPercentage) {
	$scope.sunrise = sunrise;
	$scope.sunset = sunset;
	$scope.cloudsPercentage = cloudsPercentage;

    function getSolarPower(sunrise, sunset, cloudsPercentage){
        //return power in kiloWatts for a 200 Kw solar panel
        var generatedPower = 200;
        var crt = new Date().getTime();
        if(sunrise < crt < sunset){
            return (generatedPower * cloudsPercentage).toFixed(2);
        } else {
            return 0;
        }
    }

    $scope.generatedPower = getSolarPower(sunrise, sunset, cloudsPercentage);

    $scope.ok = function() {
    	$uibModalInstance.close();
    };
});