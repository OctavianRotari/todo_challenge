process.env.NODE_ENV = "test";

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Todo = require('../app/models/todo.js');

var should = chai.should();
chai.use(chaiHttp);

describe('Todo', function(){

  Todo.collection.drop();

  beforeEach(function(done){
    var newTodo = new Todo({
      name: 'Play ping pong',
      note: 'maybe',
      completed: false
    });

    newTodo.save(function(err, data){
      console.log(data.note);
      done();
    });
  });

  afterEach(function(done){
    Todo.collection.drop();
    done()
  });

  it('should list ALL todos on /todos GET', function(done){
    chai.request(server)
    .get('/todos')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('name');
      res.body[0].should.have.property('note');
      res.body[0].should.have.property('completed');
      res.body[0].name.should.equal('Play ping pong');
      res.body[0].note.should.equal('maybe');
      res.body[0].completed.should.equal(false);
      done();
    });
  });
})
