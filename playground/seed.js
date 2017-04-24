
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

const todos = [{
  _id: new ObjectID(),
  text: 'First todo'
}, {
    _id:  new ObjectID(),
    text: 'Second todo'
  }
]
Todo.remove({}).then((result) => {
  console.log(result)
})
Todo.insertMany(todos).then((result) => {
  console.log(result)
})