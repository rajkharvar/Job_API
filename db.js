const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const dbName = 'job_api'
const url = 'mongodb://localhost:27017'
const mongoOptions = { useNewUrlParser: true }
const Joi = require('joi')

// State of the Database
const state = {
  db: null
}

const schema = Joi.object().keys({
  job: Joi.string().required(),
  description: Joi.string().required(),
  numberOfVacancy: Joi.number().required()
})

const connect = (cb) => {
  if (state.db) {
    cb()
  } else {
    MongoClient.connect(url, mongoOptions, (err, client) => {
      if (err) {
        cb(err)
      } else {
        state.db = client.db(dbName)
        cb()
      }
    })
  }
}

const getPrimaryKey = (key) => {
  return ObjectID(key)
}

const getdb = () => {
  return state.db
}

module.exports = { connect, getPrimaryKey, getdb, schema }
