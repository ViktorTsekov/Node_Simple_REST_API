require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const Person = require('./models/person')
const personHelper = require('./helpers/personHelper')

mongoose.connect(process.env.DATABASE_URI)

const app = express()
const db = mongoose.connection

db.on('error', (err) => {
  console.error('Unexpected error has occurred while connecting to db: ', err)
})

db.once('open', () => {
  console.log('Connected to Database')
})
 
app.use(express.json())

// Get all
app.get('/', async (req, res) => {
  try {
    const all = await Person.find()

    res.status(200).json(all)
  } catch(err) {
    res.status(500).json({"errorMessage": err.message})
  }
})

// Get one
app.get('/:id', getPerson, async (req, res) => {
  try {
    res.status(200).json(res.person)
  } catch(err) {
    res.status(500).json({"errorMessage": err.message})
  }
})

// Create one
app.post('/', async (req, res) => {
  try {
    const allPeople = await Person.find()

    const person = new Person({
      id: personHelper.generatePersonId(allPeople),
      name: req.body.name,
      occupation: req.body.occupation,
      education: req.body.education
    })

    if(personHelper.personIsValid(person)) {
      const newPerson = await person.save()

      res.status(200).json(newPerson)
    } else {
      res.status(400).json({"message": "Invalid arguments provided"})
    }
  } catch(err) {
    res.status(500).json({"errorMessage": err.message})
  }
})

// Update one
app.patch('/:id', getPerson, (req, res) => {
  try {
    const newPerson = new Person({
      id: res.person.id,
      name: req.body.name,
      occupation: req.body.occupation,
      education: req.body.education
    })

    if(personHelper.personIsValid(newPerson)) {
      res.person.delete()
      newPerson.save()

      res.status(400).json({"message": "User successfully updated"})
    } else {
      res.status(400).json({"message": "Invalid arguments provided"})
    }
  } catch(err) {
    res.status(500).json({"errorMessage": err.message})
  }
})

// Delete one
app.delete('/:id', getPerson, async (req, res) => {
  try {
    res.person.delete()

    res.status(200).json({"message": res.person.name + " removed successfully from db"})
  } catch(err) {
    res.status(500).json({"errorMessage": err.message})
  }
})

async function getPerson(req, res, next) {
  try {
    const all = await Person.find()
    const person = all.filter((entry) => {
      if(entry.id === parseInt(req.params.id)) {
        return entry
      }
    })[0]

    if(person == null) {
      return res.status(404).json({"message": "Person not found"})
    } else {
      res.person = person
    }
  } catch(err) {
    return res.status(500).json({"errorMessage": err.message})
  }

  next()
}

app.listen(process.env.PORT, () => console.log('Server Started'))
