const mongoose = require('mongoose');

const rdvSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    maxLength: 50,
    minLength: 2
  },
  date: {
    type: Date,
    required: true
  },
  isVisio: {
    type: Boolean,
    default: false
  },
  user: {  // l'id de l'utilisateur
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userCompany: {  // l'id de l'utilisateur de la compagnie
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCompany',
    required: true
  },
  lieu: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rdv', rdvSchema);
