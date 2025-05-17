# Dhyaan Chakra Memory Game - Final Deployment Checklist

Use this checklist to ensure a smooth deployment of the Dhyaan Chakra Memory Game.

## Pre-Deployment

- [ ] Ensure all code changes have been committed to GitHub
- [ ] Run and test the application locally
- [ ] Verify MongoDB connection works
- [ ] Check that all environment variables are properly configured

## Backend (Render) Deployment

- [ ] Create new Web Service on Render
- [ ] Connect to your GitHub repository
- [ ] Set proper configuration:
  - [ ] Name: dhyaan-chakra-api
  - [ ] Environment: Node
  - [ ] Branch: main
  - [ ] Root Directory: server
  - [ ] Build Command: npm install
  - [ ] Start Command: node server.js
  - [ ] Plan: Free (or as needed)
- [ ] Set environment variables:
  - [ ] NODE_ENV=production
  - [ ] JWT_SECRET=(your secret key)
  - [ ] MONGO_URI=(your MongoDB connection string)
  - [ ] PORT=10000 (optional)
- [ ] Deploy the service
- [ ] Verify API is running by visiting the service URL
- [ ] Test basic endpoints (e.g., GET /)

## Frontend (Vercel) Deployment

- [ ] Create new Project on Vercel
- [ ] Connect to your GitHub repository
- [ ] Set proper configuration:
  - [ ] Framework Preset: Create React App
  - [ ] Root Directory: client
  - [ ] Build Command: npm run build (default)
  - [ ] Output Directory: build (default)
- [ ] Set environment variables:
  - [ ] REACT_APP_API_URL=https://dhyaan-chakra-api.onrender.com/api
- [ ] Deploy the project
- [ ] Verify site loads at the deployment URL

## Post-Deployment Testing

- [ ] Test user registration with a new account
- [ ] Test user login with the created account
- [ ] Test game functionality at different levels
- [ ] Verify scores are being saved correctly
- [ ] Check the leaderboard displays correctly
- [ ] Verify user statistics update properly
- [ ] Test on different devices/browsers (mobile, desktop)

## Security Validation

- [ ] Check security headers are properly set (use https://securityheaders.com)
- [ ] Verify CORS is working correctly
- [ ] Test authentication with invalid credentials
- [ ] Check password security (can't see plain text passwords)

## Performance (Optional)

- [ ] Run a Lighthouse test on the deployed frontend
- [ ] Check page load speed
- [ ] Verify mobile responsiveness

## Documentation

- [ ] Update README.md with production URLs
- [ ] Document any known issues or limitations
- [ ] Create a rollback plan if needed

## Final Go-Live

- [ ] Share the application URL with team/stakeholders
- [ ] Monitor the application for the first few days
- [ ] Create a backup of the database

## PRODUCTION URLS

- Backend: https://dhyaan-chakra-api.onrender.com
- Frontend: https://dhyaan-chakra.vercel.app
