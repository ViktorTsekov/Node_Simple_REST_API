const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    require: true
  }, 
  occupation: {
    type: String,
    require: true,
    default: "-"
  }, 
  education: {
    type: String,
    require: true,
    default: "-"
  }
})

module.exports = mongoose.model('Person', personSchema)
