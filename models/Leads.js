const mongoose = require('mongoose');

const LeadsSchema = new mongoose.Schema({
  website: String,
  page: String,
  ip: String,
  details: String,
  date: { type: Date, default: new Date() }
})

const Leads = mongoose.model('leads', LeadsSchema);  // leads will be the name of the collection in DB

module.exports = Leads;
