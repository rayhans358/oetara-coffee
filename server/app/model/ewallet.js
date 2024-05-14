const mongoose = require('mongoose');
const { model, Schema} = mongoose;

const ewalletSchema = Schema ({
  name: {
    type: String,
    required: true
  },
  
  image_url: {
    type: String
  }
});

const Ewallet = model('Ewallet', ewalletSchema);

module.exports = Ewallet;