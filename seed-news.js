const mongoose = require('mongoose');
const News = require('./models/News');
const Discussion = require('./models/Discussion');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleNews = [
  {
    title: "New Digital India Initiative Launched",
    excerpt: "Government announces comprehensive digital transformation program for all government services",
    content: "The Government of India has launched a new comprehensive digital transformation initiative aimed at making all government services available online. This initiative will streamline processes and improve citizen experience across all departments.",
    author: "Digital India Team",
    category: "service",
    tags: ["digital-india", "government", "services"],
    upvotes: 45,
    comments: [
      {
        author: "citizen_user",
        content: "This is a great step forward for digital governance!",
        upvotes: 12
      },
      {
        author: "tech_enthusiast",
        content: "Looking forward to seeing how this improves service delivery.",
        upvotes: 8
      }
    ],
    isFeatured: true
  },
  {
    title: "Aadhaar Services Now Available 24/7",
    excerpt: "UIDAI extends service hours for better citizen convenience and faster processing",
    content: "The Unique Identification Authority of India (UIDAI) has announced that Aadhaar services will now be available 24/7 through online portals and select centers. This move aims to reduce waiting times and improve accessibility for citizens across the country.",
    author: "UIDAI",
    category: "service",
    tags: ["aadhaar", "uidai", "24x7"],
    upvotes: 32,
    comments: [
      {
        author: "working_professional",
        content: "Finally! No more taking leave to get Aadhaar services.",
        upvotes: 15
      }
    ]
  },
  {
    title: "Stock Market Hits New High",
    excerpt: "NIFTY 50 crosses 20,000 mark for the first time in history",
    content: "The Indian stock market reached a historic milestone today as the NIFTY 50 index crossed the 20,000 mark for the first time. This surge is attributed to strong corporate earnings and positive economic indicators.",
    author: "Market Reporter",
    category: "market",
    tags: ["nifty", "stock-market", "milestone"],
    upvotes: 78,
    comments: [
      {
        author: "investor_pro",
        content: "Great time for long-term investors!",
        upvotes: 23
      },
      {
        author: "market_analyst",
        content: "Need to be cautious about market corrections.",
        upvotes: 18
      }
    ],
    isFeatured: true
  },
  {
    title: "IT Sector Shows Strong Growth",
    excerpt: "Technology stocks lead the market rally with impressive quarterly results",
    content: "The Information Technology sector continues to show robust growth with major companies reporting strong quarterly results. Companies like TCS, Infosys, and Wipro have exceeded market expectations.",
    author: "Financial Times India",
    category: "market",
    tags: ["it-sector", "growth", "quarterly-results"],
    upvotes: 56,
    comments: []
  },
  {
    title: "Onion Prices Stabilize Across India",
    excerpt: "Government intervention helps control vegetable prices in major markets",
    content: "After weeks of price volatility, onion prices have stabilized across major markets in India. The government's intervention through buffer stock release and import measures has helped bring prices under control.",
    author: "Agriculture Ministry",
    category: "commodity",
    tags: ["onion", "prices", "agriculture"],
    upvotes: 34,
    comments: [
      {
        author: "farmer_voice",
        content: "Good news for both farmers and consumers.",
        upvotes: 9
      }
    ]
  },
  {
    title: "AI Revolution in Government Services",
    excerpt: "How artificial intelligence is transforming public service delivery in India",
    content: "Artificial Intelligence is revolutionizing the way government services are delivered to citizens. From chatbots to automated processing systems, AI is making services faster, more efficient, and accessible 24/7.",
    author: "Tech Insider",
    category: "ai",
    tags: ["ai", "government", "technology"],
    upvotes: 67,
    comments: [
      {
        author: "ai_researcher",
        content: "The potential for AI in governance is immense.",
        upvotes: 18
      }
    ]
  },
  {
    title: "System Maintenance Scheduled",
    excerpt: "Planned maintenance window this weekend for system upgrades",
    content: "We have scheduled system maintenance this weekend from 2 AM to 6 AM IST on Sunday. During this time, some services may be temporarily unavailable. We apologize for any inconvenience.",
    author: "System Admin",
    category: "admin",
    tags: ["maintenance", "system", "upgrade"],
    upvotes: 12,
    comments: [
      {
        author: "regular_user",
        content: "Thanks for the advance notice!",
        upvotes: 3
      }
    ]
  }
];

const sampleDiscussions = [
  {
    title: "How to speed up passport application process?",
    content: "I've been waiting for my passport application to be processed for over a month. Are there any ways to expedite the process? Has anyone had success with the Tatkal service?",
    author: new mongoose.Types.ObjectId(),
    authorName: "citizen_user",
    category: "service",
    tags: ["passport", "application", "tatkal"],
    upvotes: 15,
    replies: [
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "helpful_citizen",
        content: "Try the Tatkal service if you need it urgently. It costs more but processes faster.",
        upvotes: 8,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "passport_expert",
        content: "Make sure all your documents are in order. Any missing document can delay the process significantly.",
        upvotes: 12,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ],
    views: 45,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    title: "Best stocks to invest in 2024?",
    content: "Looking for advice on good stocks for long-term investment in 2024. Considering IT sector and banking. What are your thoughts?",
    author: new mongoose.Types.ObjectId(),
    authorName: "investor_pro",
    category: "market",
    tags: ["investment", "stocks", "2024"],
    upvotes: 28,
    replies: [
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "market_guru",
        content: "IT sector looks promising with digital transformation trends. Consider TCS and Infosys.",
        upvotes: 15,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "banking_analyst",
        content: "Banking sector is also good. HDFC Bank and ICICI Bank are solid choices.",
        upvotes: 12,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "risk_manager",
        content: "Don't forget to diversify your portfolio. Never put all eggs in one basket.",
        upvotes: 20,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ],
    views: 89,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isPinned: true
  },
  {
    title: "Issues with Aadhaar update service",
    content: "Has anyone faced issues with the online Aadhaar update service? My address update request has been pending for weeks.",
    author: new mongoose.Types.ObjectId(),
    authorName: "concerned_citizen",
    category: "service",
    tags: ["aadhaar", "update", "issues"],
    upvotes: 8,
    replies: [
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "aadhaar_helper",
        content: "Try visiting the nearest Aadhaar center. Sometimes online updates take longer.",
        upvotes: 5,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ],
    views: 23,
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    title: "Commodity trading tips for beginners",
    content: "New to commodity trading. Looking for basic tips and strategies. What should I know before starting?",
    author: new mongoose.Types.ObjectId(),
    authorName: "trading_newbie",
    category: "commodity",
    tags: ["commodity", "trading", "beginner"],
    upvotes: 18,
    replies: [
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "commodity_trader",
        content: "Start with understanding the basics of supply and demand. Weather and government policies heavily impact commodity prices.",
        upvotes: 10,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        author: new mongoose.Types.ObjectId(),
        authorName: "risk_advisor",
        content: "Never invest more than you can afford to lose. Commodity markets can be very volatile.",
        upvotes: 14,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ],
    views: 67,
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

async function seedNewsAndDiscussions() {
  try {
    // Clear existing data
    await News.deleteMany({});
    await Discussion.deleteMany({});
    
    console.log('Cleared existing news and discussions');

    // Insert sample news
    await News.insertMany(sampleNews);
    console.log('Inserted sample news');

    // Insert sample discussions
    await Discussion.insertMany(sampleDiscussions);
    console.log('Inserted sample discussions');

    console.log('News and discussions seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding news and discussions:', error);
    process.exit(1);
  }
}

seedNewsAndDiscussions();