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

  it('should list a SINGLE todo on /todos/<id> GET',function(done){
      var newTodo = new Todo ({
          name: 'Super',
          note: 'man',
          completed: false
      });
      newTodo.save(function(err, data){
          chai.request(server)
          .get('/todos/' + data.id)
          .end(function(err, res){
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.SUCCESS.should.have.property('_id');
              res.body.SUCCESS.should.have.property('name');
              res.body.SUCCESS.should.have.property('note');
              res.body.SUCCESS.name.should.equal('Super');
              res.body.SUCCESS.note.should.equal('man');
              res.body.SUCCESS._id.should.equal(data.id);
              done();	
          })
      })
  });

  it('should add a SINGLE todo on /todos POST', function(done){
      chai.request(server)
      .post('/todos')
      .send({'name' : 'Java', 'note': 'Script', 'completed': false})
      .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('_id');
          res.body.should.have.property('note');
          res.body.name.should.equal('Java');
          res.body.note.should.equal('Script');
          done();
      });
  });

  it('should update a SINGLE todo on /todo/<id> PUT', function(){
      chai.request(server)
      .get('/todos')
      .end(function(err, res){
          chai.request(server)
          .put('/todos/' + res.body[0]._id)
          .send({name: 'Spider'})
          .end(function(err,res){
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('UPDATED');
              res.body.UPDATED.should.have.property('name');
              res.body.UPDATED.should.have.property('_id');
              res.body.UPDATED.should.have.property('note');
              res.body.UPDATED.name.should.equal('Spider');
              done();
          });
      });
  });

  it('should delete a SINGLE todo on /todo/<id> DELETE', function(){
      chai.request(server)
      .get('/todos')
      .end(function(err, res){
          chai.request(server)
          .delete('/todos/'+ res.body[0]._id)
          .end(function(err, res){
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('REMOVED');
              res.body.REMOVED.should.have.property('name');
              res.body.REMOVED.should.have.property('_id');
              res.body.REMOVED.should.have.property('note');
              res.body.REMOVED.name.should.equal('Bat');
              res.body.REMOVED.note.should.equal('man');
              done();
          });
      });
  });
});
