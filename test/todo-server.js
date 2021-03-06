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
    var newTodo = new Todo ({
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

  describe('CRUD operations', function(done){

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
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('note');
          res.body.name.should.equal('Super');
          res.body.note.should.equal('man');
          res.body._id.should.equal(data.id);
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

    it('should update a SINGLE todo on /todo/<id> PUT', function(done){
      chai.request(server)
      .get('/todos')
      .end(function(err, res){
        chai.request(server)
        .put('/todos/' + res.body[0]._id)
        .send({'note': 'Spider'})
        .end(function(err, res){
          chai.request(server)
          .get('/todos')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('note');
            res.body[0].should.have.property('completed');
            res.body[0].name.should.equal('Play ping pong');
            res.body[0].note.should.equal('Spider');
            res.body[0].completed.should.equal(false); 
            done();
          });
        });
      });
    });

    it('should delete a SINGLE todo on /todos/<id> DELETE', function(done){
      chai.request(server)
      .get('/todos')
      .end(function(err, res){
        chai.request(server)
        .delete('/todos/'+ res.body[0]._id)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('_id');
          res.body.should.have.property('note');
          res.body.name.should.equal('Play ping pong');
          res.body.note.should.equal('maybe');
          done();
        });
      });
    });
  });
});
