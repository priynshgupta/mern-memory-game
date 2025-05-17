#!/bin/bash

# Color codes for console output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Deploying Fixed Backend to Render =====${NC}"

# Navigate to project root
cd "$(dirname "$0")"

# Check if git changes need to be committed first
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}You have uncommitted changes that need to be deployed.${NC}"
  echo "Committing all changes with the message: 'Fix Render deployment with server.js wrapper'"

  git add .
  git commit -m "Fix Render deployment with server.js wrapper and updated config"
fi

# Push to GitHub (Render will auto-deploy from main branch)
echo -e "${GREEN}Pushing to GitHub repository to deploy the fixed version...${NC}"
git push origin main

echo -e "${GREEN}Backend deployment fix has been pushed!${NC}"
echo -e "${GREEN}Check deployment status at: https://dashboard.render.com${NC}"
echo -e "${YELLOW}Note: It may take a few minutes for changes to be live.${NC}"
echo -e "${GREEN}The deployment should now correctly find the server.js file.${NC}"

echo -e "${YELLOW}Would you like to check the deployment logs? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo -e "${GREEN}Opening Render dashboard in your default browser...${NC}"
  # Use an appropriate command based on the OS
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start https://dashboard.render.com
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    open https://dashboard.render.com
  else
    xdg-open https://dashboard.render.com
  fi
fi
