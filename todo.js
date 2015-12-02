var app = angular.module('todoApp', ['ngAnimate', 'ui.bootstrap']);
app.controller('TodoListController', function($scope, $http, $uibModal, $log) {
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

  $scope.showPosition = function(pos){
    $scope.location = [pos.coords.latitude, pos.coords.longitude];
    console.log(pos);
  }

  navigator.geolocation.getCurrentPosition($scope.showPosition);
  
  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


  var todoList = this;
  todoList.todos = [
  {text:'learn angular', done:true},
  {text:'build an angular app', done:false}];


  $scope.functie = function(){
    $http({
      method: 'GET',
      url: 'http://realitatea.feedsportal.com/c/32533/fe.ed/rss.realitatea.net/tehnologie.xml',
      params: 'limit=10, sort_by=created:desc',
      headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
    }).success(function(data){
        // With the data succesfully returned, call our callback
        console.log(data);
      })
  }

  todoList.addTodo = function() {
    todoList.todos.push({text:todoList.todoText, done:false});
    todoList.todoText = '';
  };

  todoList.remaining = function() {
    var count = 0;
    angular.forEach(todoList.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  todoList.archive = function() {
    var oldTodos = todoList.todos;
    todoList.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) todoList.todos.push(todo);
    });
  };
});


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

//TODO: is this useful?
/*
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);
*/
