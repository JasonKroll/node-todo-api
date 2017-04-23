// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log(`Unable to connect to server`)
  }
  console.log('Connected to mongodb server')

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('58fc03dcecbb5259d464e1e4')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58fc0095b4810700a703172d')
  }, {
    $set: {
      name: 'Henry Ford'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })

  // db.close();
});