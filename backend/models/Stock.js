const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true, match: /^[A-Z]{1,5}$/ }
});
module.exports = mongoose.model('Stock', stockSchema);
