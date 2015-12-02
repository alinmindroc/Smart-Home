var app = angular.module('houseMonitoringApp', ['ngAnimate', 'ui.bootstrap']);
app.controller('mainController', function($scope, $http, $uibModal, $interval) {

  function getWindPower(windSpeed){
    //return power in kiloWatts for a 250 KW turbine
    var generatedPower = 250;
    return generatedPower * windSpeed / 6;
  }

  function getSolarPower(sunrise, sunset, cloudsPercentage){
    //return power in kiloWatts for a 200 Kw solar panel
    var generatedPower = 200;
    var crt = new Date().getTime();
    if(sunrise < crt < sunset){
      return generatedPower * cloudsPercentage;
    } else {
      return 0;
    }
  }


  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.comments = [
  "geotermal",
  "boiler",
  "filter",
  "battery",
  "appliances",
  "lighting",
  "wind",
  "solar"
  ]

  function getTimeString(timeStamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timeStamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
  }

  $scope.updateTime = function() {
    $scope.timeString = getTimeString(new Date().getTime());
    stop = $interval(function() {
      $scope.timeString = getTimeString(new Date().getTime());
    }, 1000 * 1);
  };

  $scope.updateTime();

  $scope.getLocation = function(){
    //get coordinates from browser
    navigator.geolocation.getCurrentPosition($scope.showPosition);
  }

  $scope.showPosition = function(pos){
    $scope.locationCoords = {lat: pos.coords.latitude, lon: pos.coords.longitude};

    //get data about weather from API
    $http({
      method: 'GET',
      url: '/proxy?url=http://api.openweathermap.org/data/2.5/weather?appid=2de143494c0b295cca9337e1e96b00e0',
      params: {lat: $scope.locationCoords.lat, lon: $scope.locationCoords.lon, units: "metric"}
    }).success(function(data){
        // With the data succesfully returned, call our callback
        $scope.location = data.name;
        $scope.weatherDescription = data.weather[0].description;
        $scope.temperature = data.main.temp;
        $scope.windSpeed = data.wind.speed;
        $scope.sunrise = getTimeString(data.sys.sunrise * 1000);
        $scope.sunset = getTimeString(data.sys.sunset * 1000);
        $scope.weatherImage = data.weather[0].icon;
        $scope.windPower = getWindPower($scope.windSpeed);
        $scope.solarPower = getSolarPower(data.sys.sunrise * 1000, data.sys.sunset*1000, $scope.cloudsPercentage);
        $scope.cloudsPercentage = data.clouds.all;
      })
  }

  $scope.getLocation();
  
  $scope.openHeatingModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: "views/heatingModal.html",
      controller: "heatingController",
      resolve: {
        state: function () {
          return $scope.heatingState;
        },
        temperature: function () {
          return $scope.heatingTemperature;
        }
      }
    });

    modalInstance.result.then(function (result) {
      $scope.heatingState = result.state;
      $scope.heatingTemperature = result.temperature;        
    });
  }

  $scope.openAcModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: "views/ACModal.html",
      controller: "ACController",
      resolve: {
        state: function () {
          return $scope.acState;
        },
        temperature: function () {
          return $scope.acTemperature;
        }
      }
    });

    modalInstance.result.then(function (result) {
      $scope.acState = result.state;
      $scope.acTemperature = result.temperature;        
    });
  };

  $scope.openAppliancesModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: "views/appliancesModal.html",
      controller: "appliancesController",
      resolve: {
        appliances: function () {
          return $scope.appliancesStates;
        }
      }
    });

    modalInstance.result.then(function (result) {
      $scope.appliancesStates = result;
    });
  };

  $scope.openLightingModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: "views/lightingModal.html",
      controller: "lightingController",
      resolve: {
        lightingPlaces: function () {
          return $scope.lightingPlaces;
        }
      }
    });

    modalInstance.result.then(function (result) {
      $scope.lightingPlaces = result;
    });
  }

  $scope.openWindModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: "views/windModal.html",
      controller: "windController",
      resolve: {
        windSpeed: function () {
          return $scope.windSpeed;
        }
      }
    });
  }

  $scope.openSolarModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: "views/solarModal.html",
      controller: "solarController",
      resolve: {
        sunrise: function () {
          return $scope.sunrise;
        },
        sunset: function () {
          return $scope.sunset;
        },
        cloudsPercentage: function() {
          return $scope.cloudsPercentage;
        }
      }
    });
  }
});
