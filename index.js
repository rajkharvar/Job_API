const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Joi = require('joi')
app.use(bodyParser.json())

const db = require('./db')
const collectionName = 'job'

// Connecting to Database
db.connect((err) => {
  if (err) {
    console.log('Cannot connect to Database')
    console.log('run mongod in console and try again')
    process.exit(1)
  } else {
    app.listen(PORT, () => {
      console.log(`Listenning on Port number: ${PORT}`)
    })
  }
})

// Inserting a new Job
app.post('/', (req, res) => {
  const userInput = req.body
  Joi.validate({ job: userInput.job, description: userInput.description, numberOfVacancy: userInput.numberOfVacancy }, db.schema, (err, documents) => {
    if (err) {
      console.log('Please add data according to schema')
      res.send('Validation error')
    } else {
      db.getdb().collection(collectionName).insertOne(userInput, (e, ack) => {
        if (e) {
          console.log(`Cannot enter to the db due to error: ${e}`)
        } else {
          res.json({ result: ack, data: ack.ops[0] })
          console.log(ack.ops[0])
        }
      })
    }
  })
})

// Getting all jobs
app.get('/', (req, res) => {
  db.getdb().collection(collectionName).find({}).toArray((err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.json(data)
    }
  })
})

// Delete a Job based on id
app.delete('/:input', (req, res) => {
  const userInput = req.params.input
  db.getdb().collection(collectionName).findOneAndDelete({ _id: db.getPrimaryKey(userInput) }, (err, ack) => {
    if (err) {
      console.log(err)
    } else {
      res.send('Deleted')
      console.log(`Job with id: ${db.getPrimaryKey(userInput)} was deleted`)
    }
  })
})
const PORT = process.env.port | 3000
