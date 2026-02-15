#!/bin/bash

echo "=== Google Custom Search Setup Helper ==="
echo ""
echo "You already have a Gemini API key in .env"
echo "You can use the SAME Google Cloud project for Custom Search!"
echo ""
echo "Steps:"
echo ""
echo "1. Go to: https://console.cloud.google.com/"
echo "   - Select the same project you used for Gemini"
echo "   - Go to 'APIs & Services' → 'Library'"
echo "   - Search for 'Custom Search API'"
echo "   - Click 'Enable'"
echo ""
echo "2. Go to: https://programmablesearchengine.google.com/"
echo "   - Click 'Add' or 'Get Started'"
echo "   - Name: 'Digital India Search'"
echo "   - What to search: Select 'Search the entire web'"
echo "   - Click 'Create'"
echo "   - Copy the 'Search engine ID' (looks like: abc123:def456)"
echo ""
echo "3. Add to .env file:"
echo "   GOOGLE_SEARCH_API_KEY=\$GEMINI_API_KEY (use same key)"
echo "   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here"
echo ""
echo "4. Restart server: npm start"
echo ""
echo "Your current Gemini API key: $(grep GEMINI_API_KEY .env | cut -d'=' -f2)"
echo ""
echo "Would you like me to add the search configuration to .env? (y/n)"
read -r response

if [ "$response" = "y" ]; then
    echo ""
    echo "Enter your Search Engine ID (from step 2):"
    read -r engine_id
    
    if [ -n "$engine_id" ]; then
        # Get the Gemini API key
        gemini_key=$(grep GEMINI_API_KEY .env | cut -d'=' -f2)
        
        # Add to .env if not already there
        if ! grep -q "GOOGLE_SEARCH_API_KEY" .env; then
            echo "" >> .env
            echo "# Google Custom Search (uses same key as Gemini)" >> .env
            echo "GOOGLE_SEARCH_API_KEY=$gemini_key" >> .env
            echo "GOOGLE_SEARCH_ENGINE_ID=$engine_id" >> .env
            echo ""
            echo "✅ Added to .env file!"
            echo "✅ Now restart your server: npm start"
        else
            echo "⚠️ GOOGLE_SEARCH_API_KEY already exists in .env"
            echo "Please edit .env manually"
        fi
    else
        echo "❌ No Search Engine ID provided"
    fi
else
    echo ""
    echo "Manual setup:"
    echo "Add these lines to your .env file:"
    echo ""
    echo "GOOGLE_SEARCH_API_KEY=$(grep GEMINI_API_KEY .env | cut -d'=' -f2)"
    echo "GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here"
fi
