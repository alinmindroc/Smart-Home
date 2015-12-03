var app = angular.module('houseMonitoringApp', ['ngAnimate', 'ui.bootstrap']);
app.controller('mainController', function($scope, $http, $uibModal, $interval) {

  $scope.totalUsedPower = 0;
  $scope.totalGeneratedPower = 0;

  function getWindPower(windSpeed){
    //return power in kiloWatts for a 250 KW turbine
    var generatedPower = 250;
    return (generatedPower * windSpeed / 6);
  }

  function getSolarPower(sunrise, sunset, cloudsPercentage){
    //return power in kiloWatts for a 200 Kw solar panel
    var generatedPower = 200;
    var crt = new Date().getTime();
    if(sunrise < crt < sunset){
      return (generatedPower * (100 - cloudsPercentage) / 100);
    } else {
      return 0;
    }
  }

  function getDateString(timeStamp){
    var date = new Date(timeStamp);
    var month = date.getMonth() + 1;//YAY JAVASCRIPT
    var day = date.getDay();

    month = ("0" + month).substr(-2);
    day = ("0" + day).substr(-2);

    var formattedDate = day + '/' + month;
    return formattedDate;
  }

  function getTimeString(timeStamp){
    var date = new Date(timeStamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    
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

  function ftoc(degreesF){
    return ((degreesF - 32) / 1.8).toFixed(2);
  }

  $scope.req = function(){
    url = "https://api.forecast.io/forecast/48a7d2a43e04051f6db3bf29f00e5e44/" + $scope.locationCoords.lat + ',' + $scope.locationCoords.lon;
    $http({
      method: 'GET',
      url: '/proxy?url=' + url
    }).success(function(data){
      var day1 = data.daily.data[0];
      var day2 = data.daily.data[1];

      $scope.forecast = [{}, {}];
      $scope.forecast[0].time = getDateString(day1.time * 1000);
      $scope.forecast[0].summary = day1.summary;
      $scope.forecast[0].tempMax = ftoc(day1.temperatureMax);
      $scope.forecast[0].tempMin = ftoc(day1.temperatureMin);

      $scope.forecast[1].time = getDateString(day2.time * 1000);
      $scope.forecast[1].summary = day2.summary;
      $scope.forecast[1].tempMax = ftoc(day2.temperatureMax);
      $scope.forecast[1].tempMin = ftoc(day2.temperatureMin);
    });
  }

  $scope.showPosition = function(pos){
    $scope.locationCoords = {lat: pos.coords.latitude, lon: pos.coords.longitude};

    $scope.req();

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
        $scope.sunriseVal = data.sys.sunrise;
        $scope.sunsetVal = data.sys.sunset;
        $scope.weatherImage = data.weather[0].icon;
        $scope.cloudsPercentage = data.clouds.all;
        var windPower = getWindPower($scope.windSpeed);
        var solarPower = getSolarPower(data.sys.sunrise * 1000, data.sys.sunset * 1000, $scope.cloudsPercentage);

        $scope.totalGeneratedPower = (windPower + solarPower).toFixed(2);
      })
  }

  $scope.getLocation = function(){
    //get coordinates from browser
    navigator.geolocation.getCurrentPosition($scope.showPosition);
  }

  $scope.getLocation();

  $scope.acPower = 0;
  $scope.appliancesPower = 0;
  $scope.heatingPower = 0;
  $scope.lightingPower = 0;

  function updateTotalUsedPower(){
    $scope.totalUsedPower = $scope.acPower + $scope.appliancesPower + $scope.heatingPower + $scope.lightingPower;
  }

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
      $scope.heatingPower = result.KW;
      updateTotalUsedPower();        
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
      $scope.acPower = result.KW; 
      updateTotalUsedPower();              
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
      $scope.appliancesStates = result.states;
      $scope.appliancesPower = result.KW;
      updateTotalUsedPower();             
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
      $scope.lightingPlaces = result.states;
      $scope.lightingPower = result.KW;
      updateTotalUsedPower();          
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
        sunriseVal: function(){
          return $scope.sunriseVal;
        },
        sunsetVal: function(){
          return $scope.sunsetVal;
        },
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
