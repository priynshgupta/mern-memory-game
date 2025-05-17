# MERN Memory Game Deployment Guide

## Project Overview

This is a memory card game built with the MERN stack (MongoDB, Express, React, Node.js). The game features user authentication, multiple difficulty levels, and a global leaderboard.

## Architecture

- **Frontend**: React.js, deployed on Vercel
- **Backend**: Node.js/Express, deployed on Render
- **Database**: MongoDB Atlas

## Deployment URLs

- **Frontend**: [Memory Game App](https://mern-memory-game-seven.vercel.app/)
- **Backend API**: [Backend API](https://dhyaan-chakra-api.onrender.com/api)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/priynshgupta/mern-memory-game.git
   cd mern-memory-game
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

5. Run the development servers:

   Backend:
   ```bash
   cd ../server
   npm start
   ```

   Frontend:
   ```bash
   cd ../client
   npm start
   ```

## Deployment Steps

### Backend Deployment (Render)

1. Push code to GitHub
2. Connect Render to your GitHub repository
3. Create a new Web Service with the following settings:
   - Build Command: `cd server && npm install`
   - Start Command: `node ../server.js`
   - Add environment variables (PORT, MONGODB_URI, JWT_SECRET)

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect Vercel to your GitHub repository
3. Set up a new project with these settings:
   - Framework Preset: Create React App
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: build
   - Add environment variable: REACT_APP_API_URL=https://dhyaan-chakra-api.onrender.com/api

## Common Issues and Fixes

1. **Render Build Error**: If you see "Cannot find module '/opt/render/project/src/server.js'", create a wrapper server.js file in the root directory that requires the actual server file.

2. **CORS Issues**: Ensure the backend server has CORS configured to allow requests from the frontend domain.

3. **JWT Authentication**: Generate a strong JWT secret and update it in both local and production environments.

4. **API Connection**: Use conditional logic for API connections based on the environment (production vs development).

5. **React Build Errors**: Check for syntax errors in context providers and fix dependency arrays in useCallback hooks.

## Verification Steps

See [VERIFICATION_STEPS.md](./VERIFICATION_STEPS.md) for a complete checklist of steps to verify the deployment.

## Maintenance

- Regularly check Render and Vercel dashboards for build and runtime errors
- Update dependencies to patch security vulnerabilities
- Monitor MongoDB Atlas usage and performance metrics
