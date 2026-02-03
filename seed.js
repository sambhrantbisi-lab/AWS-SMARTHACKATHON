const mongoose = require('mongoose');
const Service = require('./models/Service');
const MarketData = require('./models/MarketData');
const User = require('./models/User');
require('dotenv').config();

const indianGovernmentServices = [
  {
    name: 'Aadhaar Card Services',
    description: 'Aadhaar is a 12-digit unique identity number that can be obtained by residents of India, based on their biometric and demographic data. It serves as a proof of identity and address, anywhere in India.',
    shortDescription: 'Get your unique 12-digit identity number for all government services',
    category: 'identity-documents',
    subCategory: 'national-id',
    department: 'Unique Identification Authority of India (UIDAI)',
    ministry: 'Ministry of Electronics and Information Technology',
    officialWebsite: 'https://uidai.gov.in',
    applicationLinks: {
      web: 'https://resident.uidai.gov.in',
      android: 'https://play.google.com/store/apps/details?id=in.gov.uidai.mAadhaarPlus',
      ios: 'https://apps.apple.com/in/app/maadhaar/id1435469474',
      ussd: '*99*99#'
    },
    contact: {
      helpline: '1947',
      email: 'help@uidai.gov.in'
    },
    operatingHours: {
      monday: '10:00 AM - 5:00 PM',
      tuesday: '10:00 AM - 5:00 PM',
      wednesday: '10:00 AM - 5:00 PM',
      thursday: '10:00 AM - 5:00 PM',
      friday: '10:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    eligibility: {
      criteria: ['Indian resident', 'Any age'],
      documents: ['Proof of Identity', 'Proof of Address', 'Proof of Date of Birth'],
      ageLimit: { min: 0, max: 120 },
      residency: 'Indian Resident'
    },
    processingTime: {
      normal: '90 days',
      tatkal: 'Not available'
    },
    fees: {
      normal: 0,
      currency: 'INR'
    },
    languages: ['Hindi', 'English', 'Regional Languages'],
    states: ['All States and UTs'],
    accessibility: {
      wheelchairAccessible: true,
      signLanguage: true,
      braille: true,
      audioSupport: true,
      multiLanguage: true
    },
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      digitalPayment: true,
      eSign: true,
      digiLockerIntegration: true,
      aadhaarAuthentication: true
    },
    tags: ['identity', 'biometric', 'unique-id', 'uidai', 'resident'],
    faqs: [
      {
        question: 'What is Aadhaar?',
        answer: 'Aadhaar is a 12-digit unique identity number issued by UIDAI to Indian residents based on biometric and demographic data.'
      },
      {
        question: 'Is Aadhaar mandatory?',
        answer: 'Aadhaar is not mandatory but is required for various government services and benefits.'
      }
    ]
  },
  {
    name: 'PAN Card Services',
    description: 'Permanent Account Number (PAN) is a ten-character alphanumeric identifier issued by the Income Tax Department. It is mandatory for financial transactions and tax filing in India.',
    shortDescription: 'Apply for PAN card for tax filing and financial transactions',
    category: 'financial-services',
    subCategory: 'taxation',
    department: 'Income Tax Department',
    ministry: 'Ministry of Finance',
    officialWebsite: 'https://www.incometax.gov.in',
    applicationLinks: {
      web: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      android: 'https://play.google.com/store/apps/details?id=com.nsdl.tejas.pan',
      ios: 'https://apps.apple.com/in/app/pan-application/id1234567890'
    },
    contact: {
      helpline: '020-27218080',
      email: 'tinpancard@nsdl.co.in'
    },
    eligibility: {
      criteria: ['Indian citizen or foreign national', 'Engaged in financial transactions'],
      documents: ['Identity Proof', 'Address Proof', 'Date of Birth Proof'],
      ageLimit: { min: 18, max: 120 }
    },
    processingTime: {
      normal: '15-20 days',
      tatkal: '2-3 days'
    },
    fees: {
      normal: 110,
      tatkal: 1020,
      currency: 'INR'
    },
    languages: ['Hindi', 'English'],
    states: ['All States and UTs'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      digitalPayment: true,
      eSign: true,
      digiLockerIntegration: true
    },
    tags: ['pan', 'tax', 'income-tax', 'financial', 'nsdl']
  },
  {
    name: 'Passport Services',
    description: 'Indian Passport is issued by the Ministry of External Affairs for international travel. Apply for new passport, renewal, or other passport-related services online.',
    shortDescription: 'Apply for Indian passport for international travel',
    category: 'identity-documents',
    subCategory: 'travel-documents',
    department: 'Passport Seva, Ministry of External Affairs',
    ministry: 'Ministry of External Affairs',
    officialWebsite: 'https://www.passportindia.gov.in',
    applicationLinks: {
      web: 'https://portal2.passportindia.gov.in/AppOnlineProject/welcomeLink',
      android: 'https://play.google.com/store/apps/details?id=com.tcs.passportSeva',
      ios: 'https://apps.apple.com/in/app/passport-seva/id1234567891'
    },
    contact: {
      helpline: '1800-258-1800',
      email: 'support@passportindia.gov.in'
    },
    eligibility: {
      criteria: ['Indian citizen', 'Valid documents'],
      documents: ['Birth Certificate', 'Address Proof', 'Identity Proof'],
      ageLimit: { min: 0, max: 120 }
    },
    processingTime: {
      normal: '30 days',
      tatkal: '3 days'
    },
    fees: {
      normal: 1500,
      tatkal: 3500,
      currency: 'INR'
    },
    languages: ['Hindi', 'English'],
    states: ['All States and UTs'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      digitalPayment: true,
      digiLockerIntegration: true
    },
    tags: ['passport', 'travel', 'mea', 'international', 'visa']
  },
  {
    name: 'DigiLocker Services',
    description: 'DigiLocker is a digital locker system offered by the Government of India to Indian citizens to store their important documents like driving license, vehicle registration, etc. in digital format.',
    shortDescription: 'Store and access your documents digitally in secure cloud storage',
    category: 'digital-services',
    subCategory: 'document-storage',
    department: 'Ministry of Electronics and Information Technology',
    ministry: 'Ministry of Electronics and Information Technology',
    officialWebsite: 'https://digilocker.gov.in',
    applicationLinks: {
      web: 'https://digilocker.gov.in',
      android: 'https://play.google.com/store/apps/details?id=com.digilocker.android',
      ios: 'https://apps.apple.com/in/app/digilocker/id1234567892'
    },
    contact: {
      helpline: '011-24301818',
      email: 'support@digitallocker.gov.in'
    },
    eligibility: {
      criteria: ['Indian citizen with Aadhaar', 'Mobile number'],
      documents: ['Aadhaar Number', 'Mobile Number'],
      ageLimit: { min: 18, max: 120 }
    },
    processingTime: {
      normal: 'Instant'
    },
    fees: {
      normal: 0,
      currency: 'INR'
    },
    languages: ['Hindi', 'English', 'Regional Languages'],
    states: ['All States and UTs'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      eSign: true,
      digiLockerIntegration: true,
      aadhaarAuthentication: true
    },
    tags: ['digilocker', 'documents', 'digital', 'cloud', 'storage']
  },
  {
    name: 'EPFO Services',
    description: 'Employees Provident Fund Organisation provides retirement benefits to organized sector workers. Manage your PF account, check balance, withdraw funds, and transfer PF online.',
    shortDescription: 'Manage your provident fund and retirement benefits online',
    category: 'financial-services',
    subCategory: 'retirement-benefits',
    department: 'Employees Provident Fund Organisation',
    ministry: 'Ministry of Labour and Employment',
    officialWebsite: 'https://www.epfindia.gov.in',
    applicationLinks: {
      web: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
      android: 'https://play.google.com/store/apps/details?id=in.gov.epfindia.unified',
      ios: 'https://apps.apple.com/in/app/umang-epfo/id1234567893'
    },
    contact: {
      helpline: '1800-118-005',
      email: 'support@epfindia.gov.in'
    },
    eligibility: {
      criteria: ['Employee in organized sector', 'UAN number'],
      documents: ['UAN', 'Aadhaar', 'Bank Details'],
      ageLimit: { min: 18, max: 65 }
    },
    processingTime: {
      normal: '15-30 days'
    },
    fees: {
      normal: 0,
      currency: 'INR'
    },
    languages: ['Hindi', 'English'],
    states: ['All States and UTs'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      digitalPayment: true,
      eSign: true,
      aadhaarAuthentication: true
    },
    tags: ['epfo', 'pf', 'provident-fund', 'retirement', 'uan']
  },
  {
    name: 'PM-KISAN Scheme',
    description: 'Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6000 per year to small and marginal farmer families. Check eligibility, apply online, and track payment status.',
    shortDescription: 'Income support scheme for small and marginal farmers',
    category: 'social-welfare',
    subCategory: 'farmer-welfare',
    department: 'Department of Agriculture and Farmers Welfare',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    officialWebsite: 'https://pmkisan.gov.in',
    applicationLinks: {
      web: 'https://pmkisan.gov.in/RegistrationForm.aspx',
      android: 'https://play.google.com/store/apps/details?id=com.nic.pmkisan',
      ussd: '*99*99*2#'
    },
    contact: {
      helpline: '155261',
      email: 'pmkisan-ict@gov.in'
    },
    eligibility: {
      criteria: ['Small and marginal farmers', 'Landholding up to 2 hectares'],
      documents: ['Land Records', 'Aadhaar', 'Bank Account'],
      residency: 'Indian Farmer'
    },
    processingTime: {
      normal: '30-45 days'
    },
    fees: {
      normal: 0,
      currency: 'INR'
    },
    languages: ['Hindi', 'English', 'Regional Languages'],
    states: ['All States and UTs'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      aadhaarAuthentication: true
    },
    tags: ['pm-kisan', 'farmer', 'agriculture', 'income-support', 'subsidy']
  },
  {
    name: 'Ayushman Bharat - PMJAY',
    description: 'Pradhan Mantri Jan Arogya Yojana provides health insurance coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    shortDescription: 'Free health insurance coverage up to ₹5 lakh for eligible families',
    category: 'healthcare',
    subCategory: 'health-insurance',
    department: 'National Health Authority',
    ministry: 'Ministry of Health and Family Welfare',
    officialWebsite: 'https://pmjay.gov.in',
    applicationLinks: {
      web: 'https://beneficiary.nha.gov.in',
      android: 'https://play.google.com/store/apps/details?id=in.gov.nha.pmjay',
      ussd: '*99*99*3#'
    },
    contact: {
      helpline: '14555',
      email: 'support@pmjay.gov.in'
    },
    eligibility: {
      criteria: ['SECC 2011 beneficiaries', 'Eligible as per deprivation criteria'],
      documents: ['Ration Card', 'Aadhaar', 'Family ID'],
      residency: 'Indian Resident'
    },
    processingTime: {
      normal: 'Instant verification'
    },
    fees: {
      normal: 0,
      currency: 'INR'
    },
    languages: ['Hindi', 'English', 'Regional Languages'],
    states: ['All States and UTs (except Delhi, Odisha, West Bengal)'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      aadhaarAuthentication: true
    },
    tags: ['ayushman-bharat', 'pmjay', 'health-insurance', 'healthcare', 'nha']
  },
  {
    name: 'RTI Online Services',
    description: 'Right to Information Act empowers citizens to seek information from public authorities. File RTI applications online, track status, and receive responses digitally.',
    shortDescription: 'File RTI applications online to access government information',
    category: 'legal',
    subCategory: 'information-access',
    department: 'Central Information Commission',
    ministry: 'Department of Personnel and Training',
    officialWebsite: 'https://rtionline.gov.in',
    applicationLinks: {
      web: 'https://rtionline.gov.in'
    },
    contact: {
      helpline: '1800-11-1204',
      email: 'cic@nic.in'
    },
    eligibility: {
      criteria: ['Indian citizen', 'Seeking government information'],
      documents: ['Identity Proof'],
      ageLimit: { min: 18, max: 120 }
    },
    processingTime: {
      normal: '30 days'
    },
    fees: {
      normal: 10,
      currency: 'INR'
    },
    languages: ['Hindi', 'English'],
    states: ['All States and UTs'],
    digitalFeatures: {
      onlineApplication: true,
      statusTracking: true,
      digitalPayment: true
    },
    tags: ['rti', 'information', 'transparency', 'cic', 'government']
  }
];

const sampleMarketData = [
  {
    commodity: 'Onion',
    category: 'vegetables',
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon',
    prices: {
      wholesale: { min: 800, max: 1200, average: 1000 },
      retail: { min: 1200, max: 1600, average: 1400 }
    },
    unit: 'per quintal',
    quality: 'good',
    trend: 'stable'
  },
  {
    commodity: 'Tomato',
    category: 'vegetables',
    state: 'Karnataka',
    district: 'Bangalore',
    market: 'Yeshwantpur',
    prices: {
      wholesale: { min: 15, max: 25, average: 20 },
      retail: { min: 25, max: 35, average: 30 }
    },
    unit: 'per kg',
    quality: 'premium',
    trend: 'rising',
    changePercent: 5.2
  },
  {
    commodity: 'Rice',
    category: 'grains',
    state: 'Punjab',
    district: 'Amritsar',
    market: 'Amritsar Grain Market',
    prices: {
      wholesale: { min: 2800, max: 3200, average: 3000 },
      retail: { min: 35, max: 45, average: 40 }
    },
    unit: 'per quintal',
    quality: 'premium',
    trend: 'stable'
  },
  {
    commodity: 'Wheat',
    category: 'grains',
    state: 'Uttar Pradesh',
    district: 'Meerut',
    market: 'Meerut Grain Market',
    prices: {
      wholesale: { min: 2200, max: 2600, average: 2400 },
      retail: { min: 28, max: 32, average: 30 }
    },
    unit: 'per quintal',
    quality: 'good',
    trend: 'falling',
    changePercent: -2.1
  },
  {
    commodity: 'Apple',
    category: 'fruits',
    state: 'Himachal Pradesh',
    district: 'Shimla',
    market: 'Shimla Fruit Market',
    prices: {
      wholesale: { min: 80, max: 120, average: 100 },
      retail: { min: 120, max: 180, average: 150 }
    },
    unit: 'per kg',
    quality: 'premium',
    trend: 'stable'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-ai');
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@civicai.gov.in' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@civicai.gov.in',
        password: 'admin123',
        role: 'admin',
        permissions: {
          canCreateServices: true,
          canModerateChat: true,
          canAccessAnalytics: true
        },
        isVerified: true
      });
      await adminUser.save();
      console.log('Admin user created');
    }

    // Clear existing data
    await Service.deleteMany({});
    await MarketData.deleteMany({});
    console.log('Cleared existing data');

    // Insert Indian government services
    await Service.insertMany(indianGovernmentServices);
    console.log('Indian government services inserted successfully');

    // Insert market data
    await MarketData.insertMany(sampleMarketData);
    console.log('Market data inserted successfully');

    mongoose.connection.close();
    console.log('Database seeded successfully with Indian government services and market data');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();