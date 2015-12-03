angular.module('houseMonitoringApp').controller('solarController', function ($scope, $uibModalInstance, sunrise, sunset, sunriseVal, sunsetVal, cloudsPercentage) {
	$scope.sunriseVal = sunriseVal;
	$scope.sunsetVal = sunsetVal;
	$scope.cloudsPercentage = cloudsPercentage;
    $scope.sunrise = sunrise;
    $scope.sunset = sunset;

    function getSolarPower(sunrise, sunset, cloudsPercentage){
        //return power in kiloWatts for a 200 Kw solar panel
        var generatedPower = 200;
        var crt = new Date().getTime();
        if(sunrise < crt < sunset){
            return (generatedPower * (100 - cloudsPercentage) / 100).toFixed(2);
        } else {
            return 0;
        }
    }

    $scope.generatedPower = getSolarPower(sunriseVal * 1000, sunsetVal * 1000, cloudsPercentage);

    $scope.ok = function() {
    	$uibModalInstance.close();
    };
});