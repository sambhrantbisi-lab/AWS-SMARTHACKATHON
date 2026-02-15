const axios = require('axios');
const fs = require('fs');
const path = require('path');

class BharatCivicAI {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.services = this.loadBharatServices();
        this.languages = this.loadLanguages();
        this.systemPrompt = `You are an advanced AI assistant for Indian citizens seeking information about government services and public welfare schemes. You are the official digital assistant for the Government of India's civic services platform.

Your role and capabilities:
- Help citizens understand government services in multiple Indian languages
- Provide accurate, up-to-date information about eligibility, requirements, and procedures
- Be respectful and use appropriate Indian cultural context
- Handle queries in Hindi, English, and other regional languages
- Never provide medical diagnosis or legal advice - only guide to appropriate services
- Use simple, accessible language that rural and urban citizens can understand
- Include both Hindi and English terms when helpful
- Handle unexpected civic-related queries with comprehensive knowledge

Guidelines for responses:
- Always be helpful, respectful, and culturally sensitive
- Provide practical, actionable information with specific steps
- Mention relevant government schemes and their benefits
- Include contact information and office hours when available
- If you don't know something specific, admit it and suggest contacting the relevant department
- Use appropriate honorifics and formal language (आप, जी, etc.)
- Include disclaimers for health, legal, and financial matters
- Provide information in the user's preferred language when possible

Special capabilities:
- Handle complex civic queries beyond basic service matching
- Provide detailed explanations of government processes
- Explain eligibility criteria and application procedures
- Guide users through bureaucratic processes step-by-step
- Offer alternatives when primary services are unavailable
- Provide context about Indian government structure and departments

Remember: You are a comprehensive civic assistant representing the Government of India. You assist citizens in accessing public services efficiently while maintaining the highest standards of accuracy and cultural sensitivity.`;
    }

    loadBharatServices() {
        try {
            const servicesPath = path.join(__dirname, '../data/bharatServices.json');
            const data = fs.readFileSync(servicesPath, 'utf8');
            return JSON.parse(data).services;
        } catch (error) {
            console.error('Error loading Bharat services:', error);
            return [];
        }
    }

    loadLanguages() {
        try {
            const languagesPath = path.join(__dirname, '../data/languages.json');
            const data = fs.readFileSync(languagesPath, 'utf8');
            return JSON.parse(data).languages;
        } catch (error) {
            console.error('Error loading languages:', error);
            return [];
        }
    }

    // Enhanced intent classification with multi-language support
    async classifyIntent(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Healthcare keywords in multiple languages
        const healthKeywords = [
            'health', 'doctor', 'hospital', 'medicine', 'vaccine', 'treatment', 'medical', 'clinic', 'surgery',
            'स्वास्थ्य', 'डॉक्टर', 'दवा', 'इलाज', 'टीका', 'अस्पताल', 'चिकित्सा', 'दवाई', 'बीमारी',
            'ডাক্তার', 'চিকিৎসা', 'ওষুধ', 'হাসপাতাল', // Bengali
            'వైద్యుడు', 'ఆసుపత్రి', 'మందు', 'చికిత్స', // Telugu
            'डॉक्टर', 'रुग्णालय', 'औषध', 'उपचार', // Marathi
            'மருத்துவர்', 'மருந்து', 'மருத்துவமனை', 'சிகிச்சை', // Tamil
            'ડૉક્ટર', 'દવા', 'હોસ્પિટલ', 'સારવાર', // Gujarati
            'ਡਾਕਟਰ', 'ਦਵਾਈ', 'ਹਸਪਤਾਲ', 'ਇਲਾਜ' // Punjabi
        ];
        
        // Employment keywords
        const employmentKeywords = [
            'job', 'employment', 'skill', 'training', 'work', 'career', 'placement', 'unemployment',
            'नौकरी', 'काम', 'कौशल', 'प्रशिक्षण', 'रोजगार', 'बेरोजगारी', 'व्यवसाय',
            'চাকরি', 'কাজ', 'দক্ষতা', 'প্রশিক্ষণ', // Bengali
            'ఉద్యోగం', 'పని', 'నైపుణ్యం', 'శిక్షణ', // Telugu
            'नोकरी', 'काम', 'कौशल्य', 'प्रशिक्षण', // Marathi
            'வேலை', 'பணி', 'திறன்', 'பயிற்சி', // Tamil
            'નોકરી', 'કામ', 'કૌશલ્ય', 'તાલીમ', // Gujarati
            'ਨੌਕਰੀ', 'ਕੰਮ', 'ਹੁਨਰ', 'ਸਿਖਲਾਈ' // Punjabi
        ];
        
        // Education keywords
        const educationKeywords = [
            'education', 'school', 'library', 'study', 'book', 'scholarship', 'learning', 'course',
            'शिक्षा', 'स्कूल', 'पुस्तकालय', 'पढ़ाई', 'किताब', 'छात्रवृत्ति', 'अध्ययन',
            'শিক্ষা', 'স্কুল', 'লাইব্রেরি', 'পড়াশোনা', // Bengali
            'విద్య', 'పాఠశాల', 'గ్రంథాలయం', 'చదువు', // Telugu
            'शिक्षण', 'शाळा', 'ग्रंथालय', 'अभ्यास', // Marathi
            'கல்வி', 'பள்ளி', 'நூலகம்', 'படிப்பு', // Tamil
            'શિક્ષણ', 'શાળા', 'પુસ્તકાલય', 'અભ્યાસ', // Gujarati
            'ਸਿੱਖਿਆ', 'ਸਕੂਲ', 'ਲਾਇਬ੍ਰੇਰੀ', 'ਪੜ੍ਹਾਈ' // Punjabi
        ];
        
        // Housing keywords
        const housingKeywords = [
            'house', 'home', 'housing', 'rent', 'awas', 'property', 'accommodation',
            'घर', 'आवास', 'मकान', 'किराया', 'संपत्ति', 'निवास',
            'ঘর', 'বাড়ি', 'আবাস', 'ভাড়া', // Bengali
            'ఇల్లు', 'గృహం', 'ఆవాసం', 'అద్దె', // Telugu
            'घर', 'निवास', 'भाडे', 'संपत्ती', // Marathi
            'வீடு', 'இல்லம்', 'வாடகை', 'சொத்து', // Tamil
            'ઘર', 'નિવાસ', 'ભાડું', 'મિલકત', // Gujarati
            'ਘਰ', 'ਨਿਵਾਸ', 'ਕਿਰਾਇਆ', 'ਜਾਇਦਾਦ' // Punjabi
        ];
        
        // Legal keywords
        const legalKeywords = [
            'legal', 'lawyer', 'court', 'case', 'law', 'justice', 'advocate',
            'कानूनी', 'वकील', 'अदालत', 'केस', 'न्याय', 'कानून',
            'আইনি', 'উকিল', 'আদালত', 'মামলা', // Bengali
            'న్యాయ', 'న్యాయవాది', 'కోర్టు', 'కేసు', // Telugu
            'कायदेशीर', 'वकील', 'न्यायालय', 'खटला', // Marathi
            'சட்ட', 'வக்கீல்', 'நீதிமன்றம்', 'வழக்கு', // Tamil
            'કાનૂની', 'વકીલ', 'કોર્ટ', 'કેસ', // Gujarati
            'ਕਾਨੂੰਨੀ', 'ਵਕੀਲ', 'ਅਦਾਲਤ', 'ਕੇਸ' // Punjabi
        ];
        
        // Transportation keywords
        const transportKeywords = [
            'bus', 'transport', 'travel', 'metro', 'train', 'vehicle', 'traffic',
            'बस', 'परिवहन', 'यात्रा', 'मेट्रो', 'ट्रेन', 'वाहन',
            'বাস', 'পরিবহন', 'ভ্রমণ', 'মেট্রো', // Bengali
            'బస్', 'రవాణా', 'ప్రయాణం', 'మెట్రో', // Telugu
            'बस', 'वाहतूक', 'प्रवास', 'मेट्रो', // Marathi
            'பேருந்து', 'போக்குவரத்து', 'பயணம்', 'மெட்ரோ', // Tamil
            'બસ', 'પરિવહન', 'મુસાફરી', 'મેટ્રો', // Gujarati
            'ਬੱਸ', 'ਆਵਾਜਾਈ', 'ਸਫ਼ਰ', 'ਮੈਟਰੋ' // Punjabi
        ];
        
        // Welfare keywords
        const welfareKeywords = [
            'ration', 'subsidy', 'scheme', 'benefit', 'welfare', 'pension', 'allowance',
            'राशन', 'सब्सिडी', 'योजना', 'लाभ', 'कल्याण', 'पेंशन',
            'রেশন', 'ভর্তুকি', 'প্রকল্প', 'সুবিধা', // Bengali
            'రేషన్', 'సబ్సిడీ', 'పథకం', 'ప్రయోజనం', // Telugu
            'रेशन', 'अनुदान', 'योजना', 'फायदा', // Marathi
            'ரேஷன்', 'மானியம்', 'திட்டம்', 'நன்மை', // Tamil
            'રાશન', 'સબસિડી', 'યોજના', 'લાભ', // Gujarati
            'ਰਾਸ਼ਨ', 'ਸਬਸਿਡੀ', 'ਸਕੀਮ', 'ਫਾਇਦਾ' // Punjabi
        ];

        // Documentation keywords
        const documentationKeywords = [
            'passport', 'aadhaar', 'pan', 'license', 'certificate', 'document', 'id', 'card',
            'पासपोर्ट', 'आधार', 'पैन', 'लाइसेंस', 'प्रमाणपत्र', 'दस्तावेज',
            'পাসপোর্ট', 'আধার', 'প্যান', 'লাইসেন্স', // Bengali
            'పాస్‌పోర్ట్', 'ఆధార్', 'పాన్', 'లైసెన్స్', // Telugu
            'पासपोर्ट', 'आधार', 'पॅन', 'परवाना', // Marathi
            'கடவுச்சீட்டு', 'ஆதார்', 'பான்', 'உரிமம்', // Tamil
            'પાસપોર્ટ', 'આધાર', 'પાન', 'લાયસન્સ', // Gujarati
            'ਪਾਸਪੋਰਟ', 'ਆਧਾਰ', 'ਪੈਨ', 'ਲਾਇਸੈਂਸ' // Punjabi
        ];

        // Financial keywords
        const financialKeywords = [
            'bank', 'loan', 'tax', 'money', 'finance', 'account', 'payment', 'insurance',
            'बैंक', 'लोन', 'टैक्स', 'पैसा', 'वित्त', 'खाता', 'भुगतान',
            'ব্যাংক', 'ঋণ', 'কর', 'টাকা', 'অর্থ', // Bengali
            'బ్యాంకు', 'రుణం', 'పన్ను', 'డబ్బు', 'ఆర్థిక', // Telugu
            'बँक', 'कर्ज', 'कर', 'पैसा', 'वित्त', // Marathi
            'வங்கி', 'கடன்', 'வரி', 'பணம்', 'நிதி', // Tamil
            'બેંક', 'લોન', 'ટેક્સ', 'પૈસા', 'નાણાં', // Gujarati
            'ਬੈਂਕ', 'ਲੋਨ', 'ਟੈਕਸ', 'ਪੈਸਾ', 'ਵਿੱਤ' // Punjabi
        ];

        // Emergency keywords
        const emergencyKeywords = [
            'emergency', 'police', 'fire', 'ambulance', 'disaster', 'help', 'urgent',
            'आपातकाल', 'पुलिस', 'आग', 'एम्बुलेंस', 'आपदा', 'मदद',
            'জরুরি', 'পুলিশ', 'আগুন', 'অ্যাম্বুলেন্স', // Bengali
            'అత్యవసర', 'పోలీసు', 'అగ్ని', 'అంబులెన్స్', // Telugu
            'आपत्कालीन', 'पोलिस', 'आग', 'रुग्णवाहिका', // Marathi
            'அவசர', 'காவல்', 'தீ', 'ஆம்புலன்ஸ்', // Tamil
            'કટોકટી', 'પોલીસ', 'આગ', 'એમ્બ્યુલન્સ', // Gujarati
            'ਐਮਰਜੈਂਸੀ', 'ਪੁਲਿਸ', 'ਅੱਗ', 'ਐਂਬੂਲੈਂਸ' // Punjabi
        ];

        // Utilities keywords
        const utilitiesKeywords = [
            'electricity', 'water', 'gas', 'power', 'supply', 'connection', 'bill',
            'बिजली', 'पानी', 'गैस', 'बिजली', 'आपूर्ति', 'कनेक्शन', 'बिल',
            'বিদ্যুৎ', 'পানি', 'গ্যাস', 'সরবরাহ', // Bengali
            'విద్యుత్', 'నీరు', 'గ్యాస్', 'సరఫరా', // Telugu
            'वीज', 'पाणी', 'गॅस', 'पुरवठा', // Marathi
            'மின்சாரம்', 'தண்ணீர்', 'எரிவாயு', 'வழங்கல்', // Tamil
            'વીજળી', 'પાણી', 'ગેસ', 'પુરવઠો', // Gujarati
            'ਬਿਜਲੀ', 'ਪਾਣੀ', 'ਗੈਸ', 'ਸਪਲਾਈ' // Punjabi
        ];

        // Agriculture keywords
        const agricultureKeywords = [
            'agriculture', 'farming', 'crop', 'farmer', 'seed', 'fertilizer', 'irrigation',
            'कृषि', 'खेती', 'फसल', 'किसान', 'बीज', 'उर्वरक', 'सिंचाई',
            'কৃষি', 'চাষাবাদ', 'ফসল', 'কৃষক', // Bengali
            'వ్యవసాయం', 'వేళాంపు', 'పంట', 'రైతు', // Telugu
            'शेती', 'पीक', 'शेतकरी', 'बियाणे', // Marathi
            'விவசாயம்', 'பயிர்', 'விவசாயி', 'விதை', // Tamil
            'ખેતી', 'પાક', 'ખેડૂત', 'બીજ', // Gujarati
            'ਖੇਤੀ', 'ਫਸਲ', 'ਕਿਸਾਨ', 'ਬੀਜ' // Punjabi
        ];

        // Check for matches
        if (healthKeywords.some(keyword => message.includes(keyword))) return 'healthcare';
        if (employmentKeywords.some(keyword => message.includes(keyword))) return 'employment';
        if (educationKeywords.some(keyword => message.includes(keyword))) return 'education';
        if (housingKeywords.some(keyword => message.includes(keyword))) return 'housing';
        if (legalKeywords.some(keyword => message.includes(keyword))) return 'legal';
        if (transportKeywords.some(keyword => message.includes(keyword))) return 'transportation';
        if (welfareKeywords.some(keyword => message.includes(keyword))) return 'welfare';
        if (documentationKeywords.some(keyword => message.includes(keyword))) return 'documentation';
        if (financialKeywords.some(keyword => message.includes(keyword))) return 'financial';
        if (emergencyKeywords.some(keyword => message.includes(keyword))) return 'emergency';
        if (utilitiesKeywords.some(keyword => message.includes(keyword))) return 'utilities';
        if (agricultureKeywords.some(keyword => message.includes(keyword))) return 'agriculture';
        
        return 'general';
    }

    // Enhanced service matching with priority and relevance scoring
    findRelevantServices(intent, userMessage, limit = 5) {
        let relevantServices = [];
        
        if (intent !== 'general') {
            relevantServices = this.services.filter(service => 
                service.category === intent || 
                service.tags.some(tag => userMessage.toLowerCase().includes(tag))
            );
        } else {
            // For general queries, search across all services
            relevantServices = this.services.filter(service =>
                service.name.toLowerCase().includes(userMessage.toLowerCase()) ||
                service.description.toLowerCase().includes(userMessage.toLowerCase()) ||
                service.department.toLowerCase().includes(userMessage.toLowerCase()) ||
                service.tags.some(tag => userMessage.toLowerCase().includes(tag))
            );
        }

        // Sort by priority and rating
        relevantServices.sort((a, b) => {
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const aPriority = priorityOrder[a.priority] || 1;
            const bPriority = priorityOrder[b.priority] || 1;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            const aRating = a.rating ? a.rating.average : 0;
            const bRating = b.rating ? b.rating.average : 0;
            return bRating - aRating;
        });

        return relevantServices.slice(0, limit);
    }

    // Enhanced AI response generation with better ChatGPT integration
    async generateAIResponse(userMessage, intent, relevantServices, language = 'en') {
        if (!this.openaiApiKey) {
            return this.generateFallbackResponse(userMessage, intent, relevantServices, language);
        }

        try {
            const servicesContext = relevantServices.map(service => ({
                name: service.name,
                description: service.description,
                department: service.department,
                eligibility: service.eligibility,
                requirements: service.requirements,
                contact: service.contact.phone,
                schemes: service.schemes || [],
                priority: service.priority,
                rating: service.rating
            }));

            const languageInstruction = this.getLanguageInstruction(language);
            
            const prompt = `User Query: "${userMessage}"
Intent: ${intent}
Language Preference: ${language}
Relevant Services: ${JSON.stringify(servicesContext, null, 2)}

${languageInstruction}

Please provide a comprehensive, helpful response that:
1. Addresses the user's query directly and thoroughly
2. Explains relevant services in simple, accessible terms
3. Provides specific eligibility criteria and requirements
4. Includes contact information and next steps
5. Mentions relevant government schemes and their benefits
6. Provides practical guidance for accessing services
7. Includes appropriate disclaimers for health/legal/financial matters
8. Offers alternative solutions if primary services aren't suitable
9. Uses culturally appropriate language and context for India

For complex civic queries beyond basic service matching, provide detailed explanations of government processes, bureaucratic procedures, and step-by-step guidance.

Keep the response informative yet conversational, helpful, and under 300 words.`;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            return this.generateFallbackResponse(userMessage, intent, relevantServices, language);
        }
    }

    getLanguageInstruction(language) {
        const instructions = {
            'hi': 'Please respond primarily in Hindi (Devanagari script) with English terms in parentheses where helpful. Use respectful language with आप and appropriate honorifics.',
            'bn': 'Please respond primarily in Bengali (Bengali script) with English terms in parentheses where helpful. Use respectful language with আপনি.',
            'te': 'Please respond primarily in Telugu (Telugu script) with English terms in parentheses where helpful. Use respectful language with మీరు.',
            'ta': 'Please respond primarily in Tamil (Tamil script) with English terms in parentheses where helpful. Use respectful language with நீங்கள்.',
            'gu': 'Please respond primarily in Gujarati (Gujarati script) with English terms in parentheses where helpful. Use respectful language with તમે.',
            'mr': 'Please respond primarily in Marathi (Devanagari script) with English terms in parentheses where helpful. Use respectful language with तुम्ही.',
            'pa': 'Please respond primarily in Punjabi (Gurmukhi script) with English terms in parentheses where helpful. Use respectful language with ਤੁਸੀਂ.',
            'kn': 'Please respond primarily in Kannada (Kannada script) with English terms in parentheses where helpful. Use respectful language with ನೀವು.',
            'ml': 'Please respond primarily in Malayalam (Malayalam script) with English terms in parentheses where helpful. Use respectful language with നിങ്ങൾ.',
            'or': 'Please respond primarily in Odia (Odia script) with English terms in parentheses where helpful. Use respectful language with ଆପଣ.',
            'as': 'Please respond primarily in Assamese (Bengali script) with English terms in parentheses where helpful. Use respectful language with আপুনি.',
            'ur': 'Please respond primarily in Urdu (Arabic script) with English terms in parentheses where helpful. Use respectful language with آپ.',
            'en': 'Please respond in clear, simple English with Hindi terms in parentheses where helpful for Indian context.'
        };
        
        return instructions[language] || instructions['en'];
    }

    // Enhanced fallback response with multi-language support
    generateFallbackResponse(userMessage, intent, relevantServices, language = 'en') {
        if (relevantServices.length === 0) {
            const responses = {
                'hi': `मैं आपके प्रश्न "${userMessage}" को समझता हूं। हालांकि मेरे पास इस समय इससे मेल खाती विशिष्ट सेवाएं नहीं हैं, मैं आपको अपने स्थानीय सरकारी कार्यालय से संपर्क करने या निकटतम नागरिक सेवा केंद्र पर जाने की सलाह देता हूं।\n\nसामान्य सरकारी सेवाओं के लिए नागरिक हेल्पलाइन: 1950\n\nअधिक जानकारी के लिए कृपया संबंधित विभाग से संपर्क करें।`,
                'en': `I understand you're asking about "${userMessage}". While I don't have specific services matching your query right now, I recommend contacting your local government office or visiting the nearest citizen service center for assistance.\n\nCitizen helpline for general government services: 1950\n\nPlease contact the relevant department for more information.`
            };
            
            return responses[language] || responses['en'];
        }

        const service = relevantServices[0];
        const responses = {
            'hi': `आपके प्रश्न "${userMessage}" के आधार पर, मुझे यह प्रासंगिक सेवा मिली:\n\n**${service.name}**\n${service.description}\n\n**विभाग:** ${service.department}\n**संपर्क:** ${service.contact.phone}\n**पात्रता:** ${service.eligibility.join(', ')}\n\nविस्तृत जानकारी और आवेदन प्रक्रिया के लिए, कृपया विभाग से सीधे संपर्क करें या उनके कार्यालय में जाएं।\n\n*अस्वीकरण: यह सामान्य जानकारी है। कृपया आधिकारिक विभाग से विवरण की पुष्टि करें।*`,
            'en': `Based on your query about "${userMessage}", I found this relevant service:\n\n**${service.name}**\n${service.description}\n\n**Department:** ${service.department}\n**Contact:** ${service.contact.phone}\n**Eligibility:** ${service.eligibility.join(', ')}\n\nFor detailed information and application process, please contact the department directly or visit their office.\n\n*Disclaimer: This is general information. Please verify details with the official department.*`
        };
        
        return responses[language] || responses['en'];
    }

    // Enhanced suggestions with multi-language support
    generateSuggestions(intent, userMessage, language = 'en') {
        const suggestions = {
            healthcare: {
                'hi': [
                    "निकटतम PHC कहाँ है?",
                    "आयुष्मान भारत कार्ड कैसे बनवाएं?",
                    "टीकाकरण की जानकारी",
                    "जेनेरिक दवाओं की उपलब्धता"
                ],
                'en': [
                    "Where is the nearest PHC?",
                    "How to get Ayushman Bharat card?",
                    "Vaccination schedule information",
                    "Generic medicine availability"
                ]
            },
            employment: {
                'hi': [
                    "मुफ्त कौशल प्रशिक्षण कार्यक्रम",
                    "PMKVY के लिए आवेदन कैसे करें?",
                    "नौकरी प्लेसमेंट सहायता",
                    "बेरोजगारी भत्ता"
                ],
                'en': [
                    "Free skill training programs",
                    "How to apply for PMKVY?",
                    "Job placement assistance",
                    "Unemployment benefits"
                ]
            },
            education: {
                'hi': [
                    "पुस्तकालय सदस्यता प्रक्रिया",
                    "मुफ्त कंप्यूटर प्रशिक्षण",
                    "छात्रवृत्ति की जानकारी",
                    "वयस्क शिक्षा कार्यक्रम"
                ],
                'en': [
                    "Library membership process",
                    "Free computer training",
                    "Scholarship information",
                    "Adult education programs"
                ]
            },
            housing: {
                'hi': [
                    "PM आवास योजना की पात्रता",
                    "आवास सब्सिडी आवेदन",
                    "किफायती आवास योजनाएं",
                    "किराया सहायता कार्यक्रम"
                ],
                'en': [
                    "PM Awas Yojana eligibility",
                    "Housing subsidy application",
                    "Affordable housing schemes",
                    "Rental assistance programs"
                ]
            },
            legal: {
                'hi': [
                    "मुफ्त कानूनी सहायता की पात्रता",
                    "शिकायत कैसे दर्ज करें?",
                    "कानूनी परामर्श प्रक्रिया",
                    "कोर्ट फीस छूट"
                ],
                'en': [
                    "Free legal aid eligibility",
                    "How to file a complaint?",
                    "Legal consultation process",
                    "Court fee exemption"
                ]
            },
            transportation: {
                'hi': [
                    "बस रूट की जानकारी",
                    "छात्र रियायत प्रक्रिया",
                    "मेट्रो कनेक्टिविटी",
                    "वरिष्ठ नागरिक लाभ"
                ],
                'en': [
                    "Bus route information",
                    "Student concession process",
                    "Metro connectivity",
                    "Senior citizen benefits"
                ]
            },
            welfare: {
                'hi': [
                    "राशन कार्ड आवेदन",
                    "उपलब्ध सब्सिडी योजनाएं",
                    "BPL प्रमाणपत्र प्रक्रिया",
                    "खाद्य सुरक्षा कार्यक्रम"
                ],
                'en': [
                    "Ration card application",
                    "Available subsidy schemes",
                    "BPL certificate process",
                    "Food security programs"
                ]
            },
            documentation: {
                'hi': [
                    "पासपोर्ट आवेदन प्रक्रिया",
                    "आधार कार्ड अपडेट",
                    "PAN कार्ड सेवाएं",
                    "ड्राइविंग लाइसेंस"
                ],
                'en': [
                    "Passport application process",
                    "Aadhaar card update",
                    "PAN card services",
                    "Driving license"
                ]
            },
            financial: {
                'hi': [
                    "बैंक खाता खोलना",
                    "सरकारी लोन योजनाएं",
                    "टैक्स फाइलिंग सहायता",
                    "बीमा योजनाएं"
                ],
                'en': [
                    "Bank account opening",
                    "Government loan schemes",
                    "Tax filing assistance",
                    "Insurance schemes"
                ]
            },
            emergency: {
                'hi': [
                    "आपातकालीन नंबर",
                    "पुलिस स्टेशन संपर्क",
                    "अग्निशमन सेवा",
                    "एम्बुलेंस सेवा"
                ],
                'en': [
                    "Emergency numbers",
                    "Police station contact",
                    "Fire service",
                    "Ambulance service"
                ]
            },
            utilities: {
                'hi': [
                    "बिजली कनेक्शन",
                    "पानी की आपूर्ति",
                    "गैस कनेक्शन",
                    "बिल भुगतान"
                ],
                'en': [
                    "Electricity connection",
                    "Water supply",
                    "Gas connection",
                    "Bill payment"
                ]
            },
            agriculture: {
                'hi': [
                    "कृषि तकनीक प्रशिक्षण",
                    "बीज वितरण",
                    "मिट्टी परीक्षण",
                    "फसल सलाह"
                ],
                'en': [
                    "Agricultural technology training",
                    "Seed distribution",
                    "Soil testing",
                    "Crop advisory"
                ]
            },
            general: {
                'hi': [
                    "मेरे पास स्वास्थ्य सेवाएं",
                    "रोजगार के अवसर",
                    "शिक्षा संसाधन",
                    "आवास सहायता"
                ],
                'en': [
                    "Health services near me",
                    "Employment opportunities",
                    "Education resources",
                    "Housing assistance"
                ]
            }
        };

        const intentSuggestions = suggestions[intent] || suggestions.general;
        return intentSuggestions[language] || intentSuggestions['en'];
    }

    // Main method to process user query with enhanced capabilities
    async processQuery(userMessage, sessionContext = {}) {
        try {
            const language = sessionContext.language || 'en';
            
            // Classify user intent
            const intent = await this.classifyIntent(userMessage);
            
            // Find relevant services
            const relevantServices = this.findRelevantServices(intent, userMessage);
            
            // Generate AI response
            const aiResponse = await this.generateAIResponse(userMessage, intent, relevantServices, language);
            
            // Generate suggestions
            const suggestions = this.generateSuggestions(intent, userMessage, language);
            
            return {
                response: aiResponse,
                intent: intent,
                relevantServices: relevantServices,
                suggestions: suggestions.slice(0, 4),
                language: language,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error processing query:', error);
            const errorResponses = {
                'hi': "क्षमा करें, मुझे आपके प्रश्न को समझने में कुछ समस्या हो रही है। कृपया दोबारा कोशिश करें या नागरिक हेल्पलाइन 1950 पर संपर्क करें।",
                'en': "I apologize, but I'm having trouble processing your request right now. Please try again or contact the citizen helpline at 1950 for assistance."
            };
            
            const language = sessionContext.language || 'en';
            return {
                response: errorResponses[language] || errorResponses['en'],
                intent: 'error',
                relevantServices: [],
                suggestions: ["Try asking in simpler words", "Contact citizen helpline: 1950"],
                language: language,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Get service by ID
    getServiceById(serviceId) {
        return this.services.find(service => service._id === serviceId);
    }

    // Enhanced search services with multi-language support
    searchServices(query, category = null, limit = 20) {
        let filteredServices = this.services;
        
        if (category) {
            filteredServices = filteredServices.filter(service => service.category === category);
        }
        
        if (query) {
            const searchTerm = query.toLowerCase();
            filteredServices = filteredServices.filter(service =>
                service.name.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.department.toLowerCase().includes(searchTerm) ||
                service.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                (service.schemes && service.schemes.some(scheme => scheme.toLowerCase().includes(searchTerm)))
            );
        }
        
        // Sort by priority and rating
        filteredServices.sort((a, b) => {
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const aPriority = priorityOrder[a.priority] || 1;
            const bPriority = priorityOrder[b.priority] || 1;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            const aRating = a.rating ? a.rating.average : 0;
            const bRating = b.rating ? b.rating.average : 0;
            return bRating - aRating;
        });
        
        return filteredServices.slice(0, limit);
    }

    // Get available languages
    getAvailableLanguages() {
        return this.languages;
    }

    // Get service categories with counts
    getServiceCategories() {
        const categories = {};
        this.services.forEach(service => {
            if (categories[service.category]) {
                categories[service.category]++;
            } else {
                categories[service.category] = 1;
            }
        });
        
        return Object.keys(categories).map(category => ({
            name: category,
            count: categories[category],
            displayName: this.getCategoryDisplayName(category)
        }));
    }

    getCategoryDisplayName(category) {
        const displayNames = {
            'healthcare': 'स्वास्थ्य सेवाएं / Healthcare',
            'employment': 'रोजगार / Employment',
            'education': 'शिक्षा / Education',
            'housing': 'आवास / Housing',
            'legal': 'कानूनी सहायता / Legal Aid',
            'transportation': 'परिवहन / Transportation',
            'welfare': 'कल्याण योजनाएं / Welfare Schemes',
            'documentation': 'दस्तावेज़ / Documentation',
            'financial': 'वित्तीय सेवाएं / Financial Services',
            'emergency': 'आपातकालीन सेवाएं / Emergency Services',
            'utilities': 'उपयोगिताएं / Utilities',
            'agriculture': 'कृषि / Agriculture',
            'security': 'सुरक्षा / Security'
        };
        
        return displayNames[category] || category;
    }
}

module.exports = BharatCivicAI;