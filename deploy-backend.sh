#!/bin/bash

# Dhyaan Chakra Memory Game Backend Deployment Script for Render

echo "=== Backend Deployment for Dhyaan Chakra Memory Game ==="

# Check if we have required tools
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Navigate to server directory
cd server

# Install dependencies
echo "Installing dependencies..."
npm install

# Run tests if they exist
if [ -f "package.json" ] && grep -q "\"test\":" "package.json"; then
    echo "Running tests..."
    npm test
fi

# Create or update .env file for production
echo "Checking .env configuration..."
if [ ! -f ".env.production" ]; then
    echo "Warning: .env.production file not found. Please create one with your production credentials."
    echo "Required variables: MONGO_URI, JWT_SECRET"
fi

echo "Backend preparation complete."
echo "Use the render.yaml configuration to deploy to Render."
echo "Don't forget to set up the environment variables in the Render dashboard."
