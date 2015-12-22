var app = angular.module('app', ['ngRoute', 'ngResource'])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/todos.html',
    controller: 'TodoController'
  })
}]);
