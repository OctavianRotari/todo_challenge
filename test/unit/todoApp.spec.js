describe('todoAppController', function() {


  beforeEach(module('app'));

  describe('show all the todos', function(){

    var controller, scope, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope ) {

      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });

      $httpBackend = _$httpBackend_;
      $httpBackend.expect('GET' ,'/todos')
      .respond([{name: "play Guitar", note: "today", completed: false}]);
      scope = $rootScope.$new();
      controller = $controller('TodoController', {$scope: scope});
    }));

    it('display all todos', function() {
      expect(scope.todos).toEqualData([]);
      $httpBackend.flush();
      expect(scope.todos).toEqualData(
          [{name: "play Guitar", note: "today", completed: false}]);
    });

  });
});
