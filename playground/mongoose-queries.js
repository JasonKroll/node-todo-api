const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');
const {ObjectID} = require('mongodb');

// var id = '58fd1b520227498105649d30';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// // Todo.find({
// //   _id: id
// // }).then((todos) => {
// //   console.log('Todos', todos)
// // })

// // Todo.findOne({
// //   _id: id
// // }).then((todo) => {
// //   console.log('Todo', todo)
// // })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo by id', todo)
// }).catch((e) => {
//   console.log('Error in find by id: ', e)
// })

var validUserId = '58fc10b4ad0984c30135f3f1';
var nonexistingUserId = '68fc10b4ad0984c30135f3f1';
var invalidUserId = '58fc10b4ad0984c30135f3f111';

var getUser = (id) => {
  User.findById(id).then((user) => {
    if (!user) {
      return console.log('User not found')
    }
    console.log(JSON.stringify(user, undefined, 2))
  }).catch((e) => {
    console.log(e)
  });

};

getUser(validUserId);
// getUser(nonexistingUserId);
// getUser(invalidUserId);
