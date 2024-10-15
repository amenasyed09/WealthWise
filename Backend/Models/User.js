// Models/User.js

const mongoose = require('mongoose');
const validator = require('validator'); // To validate email
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email address',
    },
  },
  password: {
    type: String,
    required: false, // Optional for Google users
    minlength: 6,
  },
  profilePic: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
});

// Hash the password if it is modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password
  }
  next();
});

// Custom validation for Google ID uniqueness
userSchema.pre('validate', async function (next) {
  if (this.googleId) {
    const existingUser = await this.constructor.findOne({ googleId: this.googleId });
    if (existingUser) {
      return next(new Error('Google ID already exists'));
    }
  }
  next();
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
