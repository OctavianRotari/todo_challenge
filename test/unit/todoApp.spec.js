describe('todoAppController', function() {

  beforeEach(module('app'));
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

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('show all the todos', function(){
    it('display all todos', function() {
      expect(scope.todos).toEqualData([]);
      $httpBackend.flush();
      expect(scope.todos).toEqualData(
        [{name: "play Guitar", note: "today", completed: false}]);
    });
  });

  describe('add a new todo', function(){
    it('returns an error if the todo field is not written', function(){
      scope.newTodo = {
        todo: "",
        note: "learn"
      };
      $httpBackend.flush();
      expect( function(){ scope.save(); } ).toThrow('Fill in with todo');
    });

    describe('successfuly addded a new todo', function(){
      beforeEach(function(){
        scope.newTodo = {
          todo: "play guitar",
          note: "learn"
        };
        $httpBackend.expect('POST' ,'/todos')
        .respond({name: "play Guitar", note: "go to lessons"});
        scope.save();
        $httpBackend.flush();
      })
      it('saves a new todo', function(){
        expect(scope.todos).toContain(jasmine.objectContaining({name: "play Guitar", note: "go to lessons"}));
      });

      it('resets the new todo to epmty values', function(){
        expect(scope.newTodo).toEqual({todo: null, note: null});
      })
    });
  });
});
