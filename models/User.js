const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'service_admin'],
    default: 'user'
  },
  location: {
    state: String,
    city: String,
    district: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    animations: {
      type: Boolean,
      default: true
    },
    accessibility: {
      screenReader: Boolean,
      highContrast: Boolean,
      largeText: Boolean
    }
  },
  profile: {
    avatar: String,
    phone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    occupation: String,
    aadhaarLinked: {
      type: Boolean,
      default: false
    }
  },
  permissions: {
    canCreateServices: {
      type: Boolean,
      default: false
    },
    canModerateChat: {
      type: Boolean,
      default: false
    },
    canAccessAnalytics: {
      type: Boolean,
      default: false
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);