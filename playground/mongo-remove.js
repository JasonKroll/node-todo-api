const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

// Todo.remove({}).then((result) => {
//   console.log(result)
// })

Todo.findByIdAndRemove('58fd4b3aecbb5259d464ea86').then((todo) => {
  console.log(todo)
})