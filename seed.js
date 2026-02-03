const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const sampleServices = [
  {
    name: 'City Health Department',
    description: 'Provides public health services including vaccinations, health screenings, and disease prevention programs.',
    category: 'healthcare',
    department: 'Health Department',
    contact: {
      phone: '(555) 123-4567',
      email: 'health@city.gov',
      website: 'https://city.gov/health',
      address: {
        street: '123 Health St',
        city: 'Sample City',
        state: 'CA',
        zipCode: '90210'
      }
    },
    hours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    eligibility: ['All residents', 'Valid ID required'],
    requirements: ['Proof of residency', 'Insurance information (if available)'],
    languages: ['English', 'Spanish'],
    accessibility: {
      wheelchairAccessible: true,
      signLanguage: true,
      braille: false
    },
    tags: ['health', 'vaccination', 'screening', 'public health']
  },
  {
    name: 'Employment Development Department',
    description: 'Assists job seekers with employment services, unemployment benefits, and career development programs.',
    category: 'employment',
    department: 'Employment Development Department',
    contact: {
      phone: '(555) 234-5678',
      email: 'jobs@edd.gov',
      website: 'https://edd.gov',
      address: {
        street: '456 Work Ave',
        city: 'Sample City',
        state: 'CA',
        zipCode: '90210'
      }
    },
    hours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    eligibility: ['Unemployed individuals', 'Job seekers', 'Eligible workers'],
    requirements: ['Social Security Number', 'Work authorization'],
    languages: ['English', 'Spanish', 'Chinese'],
    accessibility: {
      wheelchairAccessible: true,
      signLanguage: true,
      braille: true
    },
    tags: ['employment', 'jobs', 'unemployment', 'benefits', 'career']
  },
  {
    name: 'Housing Authority',
    description: 'Provides affordable housing assistance, rental assistance, and housing voucher programs.',
    category: 'housing',
    department: 'Housing Authority',
    contact: {
      phone: '(555) 345-6789',
      email: 'housing@city.gov',
      website: 'https://city.gov/housing',
      address: {
        street: '789 Housing Blvd',
        city: 'Sample City',
        state: 'CA',
        zipCode: '90210'
      }
    },
    hours: {
      monday: '9:00 AM - 4:00 PM',
      tuesday: '9:00 AM - 4:00 PM',
      wednesday: '9:00 AM - 4:00 PM',
      thursday: '9:00 AM - 4:00 PM',
      friday: '9:00 AM - 4:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    eligibility: ['Low-income families', 'Elderly', 'Disabled individuals'],
    requirements: ['Income verification', 'Background check', 'Proof of citizenship or eligible immigration status'],
    languages: ['English', 'Spanish'],
    accessibility: {
      wheelchairAccessible: true,
      signLanguage: false,
      braille: false
    },
    tags: ['housing', 'affordable', 'rental assistance', 'vouchers']
  },
  {
    name: 'Public Library System',
    description: 'Offers educational resources, computer access, literacy programs, and community events.',
    category: 'education',
    department: 'Library Department',
    contact: {
      phone: '(555) 456-7890',
      email: 'info@library.gov',
      website: 'https://library.gov',
      address: {
        street: '321 Knowledge St',
        city: 'Sample City',
        state: 'CA',
        zipCode: '90210'
      }
    },
    hours: {
      monday: '10:00 AM - 8:00 PM',
      tuesday: '10:00 AM - 8:00 PM',
      wednesday: '10:00 AM - 8:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 6:00 PM',
      saturday: '10:00 AM - 5:00 PM',
      sunday: '1:00 PM - 5:00 PM'
    },
    eligibility: ['All residents', 'Visitors welcome'],
    requirements: ['Library card for borrowing'],
    languages: ['English', 'Spanish', 'French'],
    accessibility: {
      wheelchairAccessible: true,
      signLanguage: true,
      braille: true
    },
    tags: ['education', 'library', 'books', 'computer access', 'literacy']
  },
  {
    name: 'Legal Aid Society',
    description: 'Provides free legal assistance to low-income individuals and families.',
    category: 'legal',
    department: 'Legal Aid Society',
    contact: {
      phone: '(555) 567-8901',
      email: 'help@legalaid.org',
      website: 'https://legalaid.org',
      address: {
        street: '654 Justice Way',
        city: 'Sample City',
        state: 'CA',
        zipCode: '90210'
      }
    },
    hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    eligibility: ['Low-income individuals', 'Income limits apply'],
    requirements: ['Income verification', 'Legal issue documentation'],
    languages: ['English', 'Spanish'],
    accessibility: {
      wheelchairAccessible: true,
      signLanguage: true,
      braille: false
    },
    tags: ['legal', 'assistance', 'free', 'low-income', 'advice']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-ai');
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert sample services
    await Service.insertMany(sampleServices);
    console.log('Sample services inserted successfully');

    mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();