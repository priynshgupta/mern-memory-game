# Dhyaan Chakra Memory Game Deployment Guide

This comprehensive guide explains how to deploy the Dhyaan Chakra Memory Game using Render for the backend and Vercel for the frontend.

## Prerequisites

- GitHub account with access to the repository
- Render account: [Sign up](https://render.com/signup)
- Vercel account: [Sign up](https://vercel.com/signup)
- MongoDB Atlas database (already set up)

## Deploying the Backend to Render

### 1. Prepare Your Backend Code

Ensure your backend code is ready for deployment with proper environment variable handling.

### 2. Create a New Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Connect your GitHub account if not already connected
5. Select the repository containing your Dhyaan Chakra Memory Game
6. Configure the service:
   - **Name**: `dhyaan-chakra-api`
   - **Environment**: `Node`
   - **Region**: Choose a region close to your target users (e.g., Mumbai for Indian users)
   - **Branch**: `main` (or your primary branch)
   - **Root Directory**: `server` (if your backend is in a subdirectory)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (can upgrade later if needed)

### 3. Configure Environment Variables

In the Render dashboard, add the following environment variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: [your secure secret key] (You can use the existing one from the .env file)
   - `MONGO_URI`: [your MongoDB connection string] (Use the existing connection string)
   - `PORT`: `10000` (Render automatically assigns a port, but you can specify one)

### 4. Deploy the Service

1. Click "Create Web Service"
2. Render will automatically build and deploy your API
3. Note the service URL (e.g., `https://dhyaan-chakra-api.onrender.com`)

## Deploying the Frontend to Vercel

### 1. Prepare Your Frontend Code

Make sure your React app is properly configured to use the production API URL.

### 2. Create a New Project on Vercel

1. Log in to [Vercel Dashboard](https://vercel.dashboard.com/)
2. Click "Add New" and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client` (if your frontend is in a subdirectory)
   - **Build Command**: `npm run build` (should be automatically detected)
   - **Output Directory**: `build`

### 3. Configure Environment Variables

In the Vercel dashboard, add the following environment variables:
   - `REACT_APP_API_URL`: `https://dhyaan-chakra-api.onrender.com/api`

### 4. Deploy the Project

1. Click "Deploy"
2. Vercel will automatically build and deploy your frontend app
3. Note the deployment URL (e.g., `https://dhyaan-chakra.vercel.app`)

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

- For Render: Settings > Custom Domain
- For Vercel: Domains > Add

### 2. Configure CORS on Backend (Already Done)

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://dhyaan-chakra.vercel.app', 'http://localhost:3000']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

## Testing the Deployment

1. Visit your frontend URL (e.g., `https://dhyaan-chakra.vercel.app`)
2. Test the full user journey:
   - Register a new account
   - Log in with the created account
   - Play the memory game at different levels
   - Check that scores are saved correctly
   - View the leaderboard and verify your scores appear

## Troubleshooting Common Issues

### CORS Issues
- Check if your backend CORS settings include your frontend's domain
- Verify the exact protocol (http vs https) matches
- Look for CORS errors in the browser console

### API Connection Problems
- Test the backend API directly using a tool like Postman
- Verify that the `REACT_APP_API_URL` environment variable is correctly set on Vercel
- Check for any firewall or network issues

### Database Connection Issues
- Verify the MongoDB connection string is correct
- Ensure your MongoDB Atlas cluster is configured to accept connections from Render
- Check if the database user has the correct permissions

### Authentication Problems
- Verify the JWT_SECRET is properly set on Render
- Check that tokens are being properly generated and stored

## Maintenance and Monitoring

- Render provides basic monitoring for your backend service
- Set up uptime monitoring using a service like UptimeRobot
- Regularly check logs for errors or performance issues

## Scaling (Future Considerations)

- Upgrade to a paid plan on Render for better performance
- Consider adding a CDN for static assets
- Set up database indexing for faster queries as user base grows
