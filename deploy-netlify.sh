#!/bin/bash

# Netlify Deployment Script for Esports Arena
# This script bypasses .env file requirements

echo "🚀 Starting Netlify Deployment Process..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Deploying to Netlify..."
    
    # Deploy to Netlify
    netlify deploy --prod --dir=out
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "📊 Your site is now live with mock data enabled"
        echo "🔧 No backend dependencies required"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo "✨ Deployment process completed!"
