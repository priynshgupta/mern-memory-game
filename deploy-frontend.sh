#!/bin/bash

# Dhyaan Chakra Memory Game Frontend Deployment Script for Vercel

echo "=== Frontend Deployment for Dhyaan Chakra Memory Game ==="

# Check if we have required tools
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Navigate to client directory
cd client

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if we're missing environment variables
if [ ! -f ".env" ] && [ ! -f ".env.production" ]; then
    echo "Creating .env file with production API URL..."
    echo "REACT_APP_API_URL=https://dhyaan-chakra-api.onrender.com/api" > .env.production
fi

# Build the app
echo "Building application..."
npm run build

echo "Frontend build complete."
echo "Use the vercel.json configuration to deploy to Vercel."
echo "Don't forget to set up the environment variables in the Vercel dashboard."
