const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    maxLength: 50,
    minLength: 2
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    length: 50,
    required: true
  },
  phone: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isCompany: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: true
  },
},
  {
    timestamps: true
  }
)

userSchema.pre('save', function (next) {
  
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    this.password = hashedPassword
    next();
  });

})

module.exports = mongoose.model('UserCompany', userSchema);
