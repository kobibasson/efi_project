const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const SipLogSchema = new Schema({
  application: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  info: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = SipLog = mongoose.model('SIP Logs', SipLogSchema)
