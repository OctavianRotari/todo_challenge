app.controller('TodoController', ['$scope', 'Todos', '$location', function ($scope, Todos, $location) {
  $scope.newTodo = {todo: null, note: null};
  $scope.editing = [];
  $scope.todos = Todos.query();

  $scope.save = function(){
    if(!$scope.newTodo.name || $scope.newTodo.name.length < 1){
      console.log('Fill in with todo');
      return;
    } else {;
    var todo = new Todos({name:$scope.newTodo.todo, completed:false, note:$scope.newTodo.note});
    todo.$save(function(){
      $scope.todos.push(todo);
      $scope.newTodo = {todo: null, note: null};
    });
    };
  };

  $scope.edit = function(index){
    $scope.editing[index] = angular.copy($scope.todos[index]);
  };

  $scope.update = function(index){
    var todo = $scope.todos[index];
    Todos.update({id: todo._id}, todo);
    $scope.editing[index] = false;
  };

  $scope.cancel = function(index){
    $scope.todos[index] = angular.copy($scope.editing[index]);
    $scope.editing[index] = false;
  };

  $scope.delete = function(index){
    var todo = $scope.todos[index];
    Todos.remove({id: todo._id}, todo);
    $scope.todos.splice(index,1);
  };
}]);

