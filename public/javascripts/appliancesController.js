angular.module('houseMonitoringApp').controller('appliancesController', function ($scope, $uibModalInstance, appliances) {
	$scope.appliances = appliances ? appliances : [
		{name: 'fridge', 'on': true},
		{name: 'washing machine', 'on': false},
		{name: 'oven', 'on': false},
		{name: 'exhaust hood', 'on': true}
	];

    $scope.ok = function() {
    	$uibModalInstance.close($scope.appliances);
    };
});