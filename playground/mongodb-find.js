// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log(`Unable to connect to server`)
  }
  console.log('Connected to mongodb server')

  db.collection('Users').find({
    name: 'Sarah'
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch the Todos', err)
  })
  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos Count: ', count);
  // }, (err) => {
  //   console.log('Unable to fetch the Todos', err)
  // })

  // db.close();
});