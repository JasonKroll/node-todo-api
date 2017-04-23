var express = require('express');
var bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    console.log('Error creating todo: ', e)
    res.status(400).send(e);
  })
})

// GET /todos
app.get('/todos', (req, res) => {
  var todos = Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
})

// GET /todos/:id

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.send(400).send();
  })

});

app.listen(3000, () => {
  console.log('Started on port 3000.')
})

module.exports= {app};

