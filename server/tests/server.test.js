const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text: 'First todo'
}, {
    _id:  new ObjectId(),
    text: 'Second todo'
  }
]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
})

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'test todo test';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        })
      })
  })

it('should not create todo with invalid text', (done) => {
  request(app)
    .post('/todos')
    .send({text: ''})
    .expect((400))
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2)
        done();
      }).catch((err) => {
        done(err);
      })
    })
})

})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  })
})

describe('GET /todos:id', () => {
  // console.log('ID = ', todo._id)
  var id = todos[0]._id.toHexString();

  it('should get todo by id', (done) => {
    request(app)
      .get('/todos/' + id)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 for invalid id', (done) => {
    request(app)
      .get('/todos/1234546')
      .expect(404)
      .end(done);
  })

})

describe('DELETE /todos/:id', () => {
  var id = todos[0]._id.toHexString();

  it('should delete todo with valid id', (done) => {
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => {
          done(err);
        })

        // Todo.find().then((todos) => {
        //   expect(todos.length).toBe(1);
        //   done();
        // }).catch((err) => {
        //   done(err);
        // })

      })
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();
    
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid id', (done) => {
    request(app)
      .delete(`/todos/1234abc`)
      .expect(404)
      .end(done);
  })

})