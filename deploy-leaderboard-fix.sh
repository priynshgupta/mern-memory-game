#!/bin/bash

# Deployment script for updating with leaderboard fix

# Colors for console output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Deploying Leaderboard Fix =====${NC}"

# Navigate to project root
cd "$(dirname "$0")"

# Add changes to Git
git add .

# Commit with message
git commit -m "Fix leaderboard functionality with proper authentication and CORS"

# Push to remote repository
echo -e "${YELLOW}Pushing changes to remote repository...${NC}"
git push origin main

echo -e "${GREEN}Changes pushed successfully!${NC}"
echo -e "${YELLOW}The fixes include:${NC}"
echo -e "1. Fixed API authentication using axios interceptors"
echo -e "2. Updated CORS configuration to allow requests from Vercel domain"
echo -e "3. Added health check endpoint to the API"
echo -e "4. Made leaderboard endpoint more resilient for non-authenticated users"
echo
echo -e "${GREEN}The changes will be automatically deployed to Vercel.${NC}"
echo -e "${YELLOW}For the backend changes to take effect, you need to deploy to Render:${NC}"
echo -e "Run: bash deploy-fixed-backend.sh"
