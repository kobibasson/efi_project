const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const EngineerSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  kValue: {
    type: Number,
    required: true
  },
  Available: {
    type: Boolean,
    required: true
  },
  LoadLimit: {
    type: Number,
    required: true
  }
})

module.exports = SipLog = mongoose.model('Engineer', EngineerSchema)
