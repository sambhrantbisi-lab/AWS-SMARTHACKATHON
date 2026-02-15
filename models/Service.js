const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 150
  },
  category: {
    type: String,
    required: true,
    enum: [
      'identity-documents', 'financial-services', 'healthcare', 'education', 
      'employment', 'housing', 'legal', 'transportation', 'social-welfare',
      'utilities', 'emergency', 'agriculture', 'business', 'taxation',
      'digital-services', 'pension', 'insurance'
    ]
  },
  subCategory: String,
  department: {
    type: String,
    required: true
  },
  ministry: String,
  officialWebsite: {
    type: String,
    required: true
  },
  applicationLinks: {
    web: String,
    android: String,
    ios: String,
    ussd: String
  },
  contact: {
    helpline: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    }
  },
  operatingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
    holidays: String
  },
  eligibility: {
    criteria: [String],
    documents: [String],
    ageLimit: {
      min: Number,
      max: Number
    },
    residency: String
  },
  processingTime: {
    normal: String,
    tatkal: String,
    premium: String
  },
  fees: {
    normal: Number,
    tatkal: Number,
    premium: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  languages: [String],
  states: [String], // Available in which states
  accessibility: {
    wheelchairAccessible: Boolean,
    signLanguage: Boolean,
    braille: Boolean,
    audioSupport: Boolean,
    multiLanguage: Boolean
  },
  digitalFeatures: {
    onlineApplication: Boolean,
    statusTracking: Boolean,
    digitalPayment: Boolean,
    eSign: Boolean,
    digiLockerIntegration: Boolean,
    aadhaarAuthentication: Boolean
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      helpful: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  relatedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  faqs: [{
    question: String,
    answer: String,
    helpful: {
      type: Number,
      default: 0
    }
  }],
  updates: [{
    title: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['feature', 'maintenance', 'policy', 'bug-fix']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

serviceSchema.index({ name: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ category: 1, state: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ 'statistics.views': -1 });

module.exports = mongoose.model('Service', serviceSchema);