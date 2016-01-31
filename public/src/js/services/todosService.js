app.factory('Todos',['$resource', function($resource){
  return $resource('/todos/:id', {} ,{
    'update': {method:'PUT'}
  });
}]);
