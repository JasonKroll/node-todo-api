const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

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
    var hexId = new ObjectID().toHexString();
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
    var hexId = new ObjectID().toHexString();
    
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

});

describe('PATCH /todo/:id', () => {
  
  it('it should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
    var text = 'Update todo'
    request(app)
      .patch(`/todos/${id}`)
      .send({text, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  });

  it('it should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id.toHexString();
    var text = 'Update second todo'
    request(app)
      .patch(`/todos/${id}`)
      .send({text, completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done);
  });

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
  });
});

describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'user@example.com'
    var password = '123asd!'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
         return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
        }).catch((e) => done(e))
        done();
      })
  });

  it('should return validation errors if request is invalid', (done) => {
    var email = 'henry';
    var password = '123'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email is in use', (done) => {
    var email = users[0].email
    var password = '1234567'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

  });

})

  describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e))
        });
    });

    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: '1234'
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e))
        });
    }); 

  })

describe('DELETE /users/me/tokens', () => {
  it('should remove auth token on log out', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e))
      })
  })
})