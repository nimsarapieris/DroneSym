const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    lowercase: true,
    required: true,
    default: 'user',
  },
  email: {
    type: String,
    required: true,
  },
  groups: {
    type: [{
      groupId: String,
      groupName: String,
    }],
    default: [],
  },

}, {timestamps: true});

userSchema.pre('save', function(next) {
  const user = this;
  const SALT_FACTOR = 5;

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, callBack) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      callBack(err, null);
      return;
    }
    callBack(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
